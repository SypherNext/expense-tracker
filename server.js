import http from 'node:http';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { addExpense, removeExpense, ValidationError } from './public/expenses.js';

const PORT = 4400;
const DATA_FILE = path.join(import.meta.dirname, 'data', 'expenses.json');
const PUBLIC_DIR = path.join(import.meta.dirname, 'public');
const MAX_BODY_BYTES = 10_000;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

async function loadExpenses() {
  return JSON.parse(await readFile(DATA_FILE, 'utf-8'));
}

async function saveExpenses(expenses) {
  await writeFile(DATA_FILE, JSON.stringify(expenses, null, 2) + '\n', 'utf-8');
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  let text = '';
  for await (const chunk of req) {
    text += chunk;
    if (text.length > MAX_BODY_BYTES) {
      throw new RangeError('Request body is too large');
    }
  }
  return JSON.parse(text);
}

async function serveFile(res, urlPath) {
  const name = urlPath === '/' ? 'index.html' : urlPath.slice(1);
  const file = path.join(PUBLIC_DIR, name);
  // Refuse paths such as /../data/expenses.json that climb out of public/
  if (!file.startsWith(PUBLIC_DIR + path.sep) || !TYPES[path.extname(file)]) {
    return sendJson(res, 404, { error: 'Not found' });
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] });
    res.end(body);
  } catch {
    sendJson(res, 404, { error: 'Not found' });
  }
}

async function handle(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const idMatch = pathname.match(/^\/api\/expenses\/(\d+)$/);

  if (pathname === '/api/expenses' && req.method === 'GET') {
    return sendJson(res, 200, await loadExpenses());
  }
  if (pathname === '/api/expenses' && req.method === 'POST') {
    const input = await readJsonBody(req);
    const updated = addExpense(await loadExpenses(), input);
    await saveExpenses(updated);
    return sendJson(res, 201, updated.at(-1));
  }
  if (idMatch && req.method === 'DELETE') {
    const id = Number(idMatch[1]);
    const expenses = await loadExpenses();
    if (!expenses.some((e) => e.id === id)) {
      return sendJson(res, 404, { error: `No expense with id ${id}` });
    }
    await saveExpenses(removeExpense(expenses, id));
    res.writeHead(204);
    return res.end();
  }
  if (req.method === 'GET' && !pathname.startsWith('/api/')) {
    return serveFile(res, pathname);
  }
  sendJson(res, 404, { error: 'Not found' });
}

const server = http.createServer(async (req, res) => {
  try {
    await handle(req, res);
  } catch (error) {
    if (error instanceof ValidationError) {
      sendJson(res, 400, { error: error.message, field: error.field });
    } else if (error instanceof SyntaxError) {
      sendJson(res, 400, { error: 'Body must be valid JSON' });
    } else if (error instanceof RangeError) {
      sendJson(res, 413, { error: error.message });
    } else {
      console.error(error);
      sendJson(res, 500, { error: 'Something went wrong' });
    }
  }
  console.log(req.method, req.url, res.statusCode);
});

server.listen(PORT, () => {
  console.log(`Expense Tracker running at http://localhost:${PORT}/`);
});

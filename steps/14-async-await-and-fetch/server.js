import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { text } from 'node:stream/consumers';
import { setTimeout as sleep } from 'node:timers/promises';
import { validateExpense, ValidationError } from './src/expenses.js';

const PORT = 4400;
const file = new URL('./data/expenses.json', import.meta.url);
const expenses = JSON.parse(await readFile(file, 'utf-8'));

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function handle(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  console.log(`${req.method} ${url.pathname}${url.search}`);

  // ?delay=2000 makes the answer slow, to practise timeouts
  const delay = Number(url.searchParams.get('delay') ?? 0);
  if (delay > 0) await sleep(Math.min(delay, 10000));

  if (url.pathname === '/api/expenses' && req.method === 'GET') {
    return sendJson(res, 200, expenses);
  }

  if (url.pathname === '/api/expenses' && req.method === 'POST') {
    let input;
    try {
      input = JSON.parse(await text(req));
    } catch {
      return sendJson(res, 400, { error: 'The body must be JSON' });
    }
    try {
      const expense = validateExpense(input);
      const id = expenses.reduce((max, e) => Math.max(max, e.id), 0) + 1;
      const saved = { id, ...expense };
      expenses.push(saved);
      return sendJson(res, 201, saved);
    } catch (error) {
      if (error instanceof ValidationError) {
        return sendJson(res, 400, { error: error.message, field: error.field });
      }
      throw error;
    }
  }

  sendJson(res, 404, { error: 'Not found' });
}

const server = createServer((req, res) => {
  handle(req, res).catch((error) => {
    console.error(error);
    sendJson(res, 500, { error: 'Something went wrong on the server' });
  });
});

server.listen(PORT, () => {
  console.log(`Expense API listening on http://localhost:${PORT}`);
});

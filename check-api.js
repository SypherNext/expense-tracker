// Talks to the running server.js the way the browser does, and prints each answer.
const BASE = 'http://localhost:4400';

async function show(label, path, options) {
  const response = await fetch(BASE + path, options);
  const text = response.status === 204 ? '(no body)' : await response.text();
  console.log(`${label}: ${response.status} ${text}`);
}

const json = { 'Content-Type': 'application/json' };

await show('GET list', '/api/expenses');
await show('POST good', '/api/expenses', {
  method: 'POST',
  headers: json,
  body: JSON.stringify({ title: 'Lunch', cents: 1150, category: 'food', date: '2026-11-04' }),
});
await show('POST bad', '/api/expenses', {
  method: 'POST',
  headers: json,
  body: JSON.stringify({ title: 'Lunch', cents: 11.5, category: 'food', date: '2026-11-04' }),
});
await show('POST not JSON', '/api/expenses', { method: 'POST', headers: json, body: '{title: Lunch}' });
await show('DELETE 6', '/api/expenses/6', { method: 'DELETE' });
await show('DELETE 6 again', '/api/expenses/6', { method: 'DELETE' });
await show('GET data file', '/data/expenses.json');
await show('GET unknown', '/api/budgets');

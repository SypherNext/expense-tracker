const BASE = 'http://localhost:4400';

export class ApiError extends Error {
  constructor(status, body) {
    super(body.error ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.field = body.field;
  }
}

async function request(path, options = {}) {
  const response = await fetch(BASE + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    signal: options.signal ?? AbortSignal.timeout(5000),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new ApiError(response.status, body);
  }
  return body;
}

export function getExpenses() {
  return request('/api/expenses');
}

export function createExpense(expense) {
  return request('/api/expenses', { method: 'POST', body: JSON.stringify(expense) });
}

import { ValidationError } from './expenses.js';

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(5000),
  });
  if (response.status === 204) {
    return null;
  }
  const body = await response.json();
  if (!response.ok) {
    if (body.field) {
      throw new ValidationError(body.field, body.error);
    }
    throw new Error(body.error ?? `Request failed with status ${response.status}`);
  }
  return body;
}

export function fetchExpenses() {
  return request('/api/expenses');
}

export function createExpense(input) {
  return request('/api/expenses', { method: 'POST', body: JSON.stringify(input) });
}

export function deleteExpense(id) {
  return request(`/api/expenses/${id}`, { method: 'DELETE' });
}

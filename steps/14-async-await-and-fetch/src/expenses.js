export const CATEGORIES = ['food', 'transport', 'fun', 'bills', 'other'];

export class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export function validateExpense(input) {
  const title = String(input.title ?? '').trim();
  if (title === '') {
    throw new ValidationError('title', 'Title is required');
  }
  if (!Number.isInteger(input.cents) || input.cents <= 0) {
    throw new ValidationError('cents', 'Amount must be a whole number of cents above 0');
  }
  if (!CATEGORIES.includes(input.category)) {
    throw new ValidationError('category', `Unknown category "${input.category}"`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date ?? '')) {
    throw new ValidationError('date', 'Date must look like 2026-11-04');
  }
  return { title, cents: input.cents, category: input.category, date: input.date };
}

export function totalCents(expenses) {
  return expenses.reduce((sum, e) => sum + e.cents, 0);
}

export function totalsByCategory(expenses) {
  const totals = {};
  for (const e of expenses) {
    totals[e.category] = (totals[e.category] ?? 0) + e.cents;
  }
  return totals;
}

export function addExpense(expenses, input) {
  const expense = validateExpense(input);
  const nextId = expenses.reduce((max, e) => Math.max(max, e.id), 0) + 1;
  return [...expenses, { id: nextId, ...expense }];
}

export function removeExpense(expenses, id) {
  return expenses.filter((e) => e.id !== id);
}

import { getExpenses, createExpense, ApiError } from './api.js';
import { formatCents, percent } from './src/format.js';
import { totalCents } from './src/expenses.js';

const BUDGET_CENTS = 50000;

const saved = await createExpense({ title: 'Lunch', cents: 1150, category: 'food', date: '2026-11-04' });
console.log('created:', saved);

try {
  await createExpense({ title: 'Taxi', cents: 0, category: 'transport', date: '2026-11-04' });
} catch (error) {
  if (!(error instanceof ApiError)) throw error;
  console.log(`rejected with ${error.status} on "${error.field}": ${error.message}`);
}

const expenses = await getExpenses();
const spent = totalCents(expenses);
console.log(`${expenses.length} expenses, ${formatCents(spent)} spent, ${percent(spent, BUDGET_CENTS)}% of budget`);

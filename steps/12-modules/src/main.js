import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { formatCents, percent } from './format.js';
import { totalCents, totalsByCategory, addExpense } from './expenses.js';

const BUDGET_CENTS = 50000;
const file = join(import.meta.dirname, '..', 'data', 'expenses.json');
let expenses = JSON.parse(readFileSync(file, 'utf-8'));
expenses = addExpense(expenses, { title: 'Lunch', cents: 1150, category: 'food', date: '2026-11-04' });

const spent = totalCents(expenses);
console.log(`${expenses.length} expenses, ${formatCents(spent)} spent`);
console.log(`${percent(spent, BUDGET_CENTS)}% of the ${formatCents(BUDGET_CENTS)} budget`);
for (const [category, cents] of Object.entries(totalsByCategory(expenses))) {
  console.log(`  ${category.padEnd(10)} ${formatCents(cents)}`);
}

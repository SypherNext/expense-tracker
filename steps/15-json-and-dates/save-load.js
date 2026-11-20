import { addExpense, totalCents } from './src/expenses.js';
import { formatCents } from './src/format.js';
import { loadExpenses, saveExpenses } from './src/storage.js';

const file = new URL('./data/expenses.json', import.meta.url);

const expenses = await loadExpenses(file);
console.log('loaded', expenses.length, 'expenses,', formatCents(totalCents(expenses)));

const updated = addExpense(expenses, { title: 'Lunch', cents: 1150, category: 'food', date: '2026-11-04' });
await saveExpenses(file, updated);

const again = await loadExpenses(file);
console.log('after saving:', again.length, 'expenses,', formatCents(totalCents(again)));
console.log(again.at(-1));

const missing = await loadExpenses(new URL('./data/nothing-here.json', import.meta.url));
console.log('missing file gives', missing);

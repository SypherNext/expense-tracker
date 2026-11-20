// Expense Tracker, lesson 2: money is stored in whole cents
const trackerName = 'Expense Tracker';
const budgetCents = 50000;
let spentCents = 0;

spentCents += 5420; // Groceries
spentCents += 3000; // Bus pass
spentCents += 450; // Coffee

const leftCents = budgetCents - spentCents;

console.log(trackerName);
console.log('Spent (cents):', spentCents);
console.log('Left (cents):', leftCents);
console.log('Left (dollars):', leftCents / 100);

// Expense Tracker, lesson 6: the first helper functions
function formatCents(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function percentOfBudget(spentCents, budgetCents = 50000) {
  return Math.round((spentCents * 100) / budgetCents);
}

function sumCents(...amounts) {
  let total = 0;
  for (const cents of amounts) {
    total += cents;
  }
  return total;
}

const budgetStatus = (percent) => {
  if (percent > 100) return 'over budget';
  if (percent >= 80) return 'close to budget';
  return 'on track';
};

const amounts = [5420, 3000, 450, 1200, 2500];
const spent = sumCents(...amounts);
const percent = percentOfBudget(spent);

console.log(`Spent ${formatCents(spent)} of ${formatCents(50000)}`);
console.log(`${percent}% used, ${budgetStatus(percent)}`);
console.log(`Largest expense: ${formatCents(Math.max(...amounts))}`);

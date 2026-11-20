function createTracker(budgetCents) {
  const expenses = [];

  function total() {
    return expenses.reduce((sum, e) => sum + e.cents, 0);
  }

  return {
    add(title, cents) {
      expenses.push({ id: expenses.length + 1, title, cents });
      return expenses.length;
    },
    total,
    left() {
      return budgetCents - total();
    },
  };
}

const november = createTracker(50000);
november.add('Groceries', 5420);
november.add('Bus pass', 3000);
november.add('Coffee', 450);

const trip = createTracker(20000);
trip.add('Train ticket', 6500);

console.log(november.total(), november.left());
console.log(trip.total(), trip.left());
console.log(november.expenses);
console.log(Object.keys(november));

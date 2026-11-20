class ExpenseTracker {
  #expenses = [];

  constructor(budgetCents) {
    this.budgetCents = budgetCents;
  }

  add(title, cents) {
    const expense = { id: this.#expenses.length + 1, title, cents };
    this.#expenses.push(expense);
    return expense;
  }

  get totalCents() {
    return this.#expenses.reduce((sum, e) => sum + e.cents, 0);
  }

  get leftCents() {
    return this.budgetCents - this.totalCents;
  }

  static fromList(budgetCents, list) {
    const tracker = new ExpenseTracker(budgetCents);
    for (const e of list) tracker.add(e.title, e.cents);
    return tracker;
  }
}

const november = new ExpenseTracker(50000);
console.log(november.add('Groceries', 5420));
november.add('Bus pass', 3000);
november.add('Coffee', 450);
console.log(november.totalCents, november.leftCents);

const trip = ExpenseTracker.fromList(20000, [{ title: 'Train ticket', cents: 6500 }]);
console.log(trip.totalCents, trip.leftCents);

console.log(november);
console.log(november.expenses, Object.keys(november));
console.log(typeof ExpenseTracker);

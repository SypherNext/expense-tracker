const CATEGORIES = ['food', 'transport', 'fun', 'bills', 'other'];

class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

function validateExpense(input) {
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

const inputs = [
  { title: ' Lunch ', cents: 1150, category: 'food', date: '2026-11-04' },
  { title: '   ', cents: 1150, category: 'food', date: '2026-11-04' },
  { title: 'Lunch', cents: 11.5, category: 'food', date: '2026-11-04' },
  { title: 'Lunch', cents: 1150, category: 'snacks', date: '2026-11-04' },
  { title: 'Lunch', cents: 1150, category: 'food', date: '4 Nov' },
];

for (const input of inputs) {
  try {
    const expense = validateExpense(input);
    console.log('ok:', expense);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log(`${error.name} on "${error.field}": ${error.message}`);
    } else {
      throw error;
    }
  }
}

const sample = new ValidationError('cents', 'Amount must be a whole number of cents above 0');
console.log(sample instanceof ValidationError, sample instanceof Error);
console.log(sample.stack.split('\n')[0]);

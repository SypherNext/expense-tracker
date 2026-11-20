import { ValidationError, validateExpense, totalCents, totalsByCategory } from './expenses.js';
import { formatCents, percent } from './format.js';
import { fetchExpenses, createExpense, deleteExpense } from './api.js';

const BUDGET_CENTS = 50000;
// Dates are stored as '2026-11-04'. new Date() reads those as midnight UTC (lesson 15),
// so they are also formatted in UTC to show the same day everywhere.
const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });

const state = { expenses: [], filter: 'all' };

const form = document.querySelector('#add-form');
const formError = document.querySelector('#form-error');
const list = document.querySelector('#list');
const filterSelect = document.querySelector('#filter');
const status = document.querySelector('#status');

function todayText() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function renderExpense(expense) {
  const item = document.createElement('li');
  item.dataset.id = expense.id;

  const text = document.createElement('div');
  const title = document.createElement('span');
  title.className = 'title';
  title.textContent = expense.title;
  const meta = document.createElement('span');
  meta.className = 'meta';
  meta.textContent = `${expense.category}, ${dateFormat.format(new Date(expense.date))}`;
  text.append(title, meta);

  const amount = document.createElement('span');
  amount.className = 'amount';
  amount.textContent = formatCents(expense.cents);

  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.id = expense.id;
  button.textContent = 'Delete';

  item.append(text, amount, button);
  return item;
}

function renderList() {
  const visible =
    state.filter === 'all' ? state.expenses : state.expenses.filter((e) => e.category === state.filter);
  const newestFirst = visible.toSorted((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  list.replaceChildren(...newestFirst.map(renderExpense));
  if (visible.length === 0 && status.dataset.kind !== 'error') {
    status.textContent = state.expenses.length === 0 ? 'No expenses yet.' : `No ${state.filter} expenses.`;
  } else if (status.dataset.kind !== 'error') {
    status.textContent = '';
  }
}

function renderSummary() {
  const spent = totalCents(state.expenses);
  const used = percent(spent, BUDGET_CENTS);
  document.querySelector('#total').textContent = `Total: ${formatCents(spent)}`;
  const bar = document.querySelector('#budget-bar');
  bar.style.width = `${Math.min(used, 100)}%`;
  bar.classList.toggle('over', spent > BUDGET_CENTS);
  document.querySelector('#budget-text').textContent =
    `${used}% of your ${formatCents(BUDGET_CENTS)} budget, ${formatCents(BUDGET_CENTS - spent)} left`;

  const totals = totalsByCategory(state.expenses);
  const items = Object.entries(totals).map(([category, cents]) => {
    const item = document.createElement('li');
    item.textContent = `${category} ${formatCents(cents)}`;
    return item;
  });
  document.querySelector('#by-category').replaceChildren(...items);
}

function render() {
  renderSummary();
  renderList();
}

function showStatus(message) {
  status.dataset.kind = 'error';
  status.textContent = message;
}

function clearFormError() {
  formError.textContent = '';
  for (const field of form.elements) {
    field.classList.remove('invalid');
  }
}

function showFormError(error) {
  formError.textContent = error.message;
  const field = form.elements[error.field === 'cents' ? 'amount' : error.field];
  field?.classList.add('invalid');
  field?.focus();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearFormError();
  const data = new FormData(form);
  const input = {
    title: data.get('title'),
    cents: Math.round(Number(data.get('amount')) * 100),
    category: data.get('category'),
    date: data.get('date'),
  };
  try {
    validateExpense(input); // the same rules the server uses, checked before the request
    const saved = await createExpense(input);
    state.expenses = [...state.expenses, saved];
    form.reset();
    form.elements.date.value = todayText();
    render();
    form.elements.title.focus();
  } catch (error) {
    if (error instanceof ValidationError) {
      showFormError(error);
    } else {
      formError.textContent = `Could not save: ${error.message}`;
    }
  }
});

list.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-id]');
  if (!button) {
    return;
  }
  const id = Number(button.dataset.id);
  button.disabled = true;
  try {
    await deleteExpense(id);
    state.expenses = state.expenses.filter((e) => e.id !== id);
    render();
  } catch (error) {
    button.disabled = false;
    showStatus(`Could not delete: ${error.message}`);
  }
});

filterSelect.addEventListener('change', () => {
  state.filter = filterSelect.value;
  renderList();
});

async function start() {
  form.elements.date.value = todayText();
  status.textContent = 'Loading expenses...';
  try {
    state.expenses = await fetchExpenses();
    status.textContent = '';
  } catch (error) {
    showStatus(`Could not load expenses (${error.message}). Is the server running?`);
  }
  render();
}

start();

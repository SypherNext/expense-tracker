import { readFile, writeFile } from 'node:fs/promises';

export async function loadExpenses(file) {
  try {
    const text = await readFile(file, 'utf-8');
    return JSON.parse(text);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // no file yet: start with an empty list
    }
    throw error;
  }
}

export async function saveExpenses(file, expenses) {
  const text = JSON.stringify(expenses, null, 2) + '\n';
  await writeFile(file, text, 'utf-8');
}

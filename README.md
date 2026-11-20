# Expense Tracker

A small web app for recording what you spend: a page in the browser lists, adds, filters and deletes expenses, shows the total, a total per category and a bar against a $500.00 budget, and a Node.js server stores the expenses in `data/expenses.json`. It is the companion code for the Sypher course "JavaScript Fundamentals". The root of this repository is the finished app from the capstone lesson, and `steps/` holds the tracker as it looks after each earlier lesson that changes it. Everything uses plain JavaScript and modules that come with Node.js, so there are no npm packages to install.

## Set up your computer

You need three things: Node.js, Git and a current web browser.

### Node.js

Use Node.js 24 LTS or newer. The course is written for Node.js 26 LTS, and any current LTS line works. Installing Node.js also installs npm.

On Windows, either run the installer from the official download page (https://nodejs.org/en/download) or use winget in a terminal:

```bash
winget install OpenJS.NodeJS.LTS
```

On macOS, either run the installer from the same download page or use Homebrew:

```bash
brew install node@24
```

Homebrew installs `node@24` without adding it to your `PATH` and prints the line to add to your shell profile. Follow that hint, then open a new terminal.

On Linux, the `nodejs` package in many distributions is too old, so use a version manager. With nvm (https://github.com/nvm-sh/nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# open a new terminal, then:
nvm install --lts
```

fnm (https://github.com/Schniz/fnm) works the same way (`fnm install --lts`), and both also work on macOS if you want to switch Node.js versions per project.

Open a new terminal and check:

```bash
node --version
npm --version
```

You see version numbers like these (yours may be newer):

```text
v24.19.0
11.17.0
```

If the terminal says `command not found` or `is not recognized`, close it and open a new one so it picks up the updated `PATH`.

### Git

On Windows:

```bash
winget install --id Git.Git -e
```

On macOS, `xcode-select --install` installs Git with Apple's command line tools, or use Homebrew:

```bash
brew install git
```

On Linux, use your package manager:

```bash
sudo apt install git     # Debian, Ubuntu
sudo dnf install git     # Fedora, RHEL
```

Check it:

```bash
git --version
```

```text
git version 2.41.0
```

Any 2.x version is fine.

### A browser

A current Chrome, Edge or Firefox. Its developer tools (F12) show the console, which you need when a page does nothing.

### Get the code

Clone the repository into the folder where you keep your projects (use the address shown on the repository page):

```bash
git clone <repository URL> expense-tracker
cd expense-tracker
```

If you do not want to use Git, download the repository as a ZIP file from its page, unzip it and open a terminal in the unzipped `expense-tracker` folder.

## Run the app

1. Open a terminal in the `expense-tracker` folder. There is nothing to install: `package.json` only sets `"type": "module"` so `.js` files are ES modules.
2. Start the server:

   ```bash
   node server.js
   ```

   ```text
   Expense Tracker running at http://localhost:4400/
   ```

   Leave it running. It logs one line per request, and Ctrl+C stops it.
3. In a second terminal, in the same folder, check the API:

   ```bash
   node check-api.js
   ```

   With the five sample expenses in `data/expenses.json` you see:

   ```text
   GET list: 200 [{"id":1,"title":"Groceries","cents":5420,"category":"food","date":"2026-11-02"},{"id":2,"title":"Bus pass","cents":3000,"category":"transport","date":"2026-11-01"},{"id":3,"title":"Coffee","cents":450,"category":"food","date":"2026-11-03"},{"id":4,"title":"Cinema","cents":1200,"category":"fun","date":"2026-11-03"},{"id":5,"title":"Phone bill","cents":2500,"category":"bills","date":"2026-11-04"}]
   POST good: 201 {"id":6,"title":"Lunch","cents":1150,"category":"food","date":"2026-11-04"}
   POST bad: 400 {"error":"Amount must be a whole number of cents above 0","field":"cents"}
   POST not JSON: 400 {"error":"Body must be valid JSON"}
   DELETE 6: 204 (no body)
   DELETE 6 again: 404 {"error":"No expense with id 6"}
   GET data file: 404 {"error":"Not found"}
   GET unknown: 404 {"error":"Not found"}
   ```

   The script adds Lunch and deletes it again, so the list ends where it started.
4. Open http://localhost:4400/ in your browser. You see a total of $125.70, 25% of the $500.00 budget, and five expenses newest first. Add one with the form, pick a category in the Show list, delete one with its Delete button, then reload the page: your changes come back from the server.

Every change is written to `data/expenses.json`. The first write also reformats the file with one property per line; the data is the same. To get the five sample expenses back, stop the server and run `git checkout -- data/expenses.json`.

## Project layout

```text
expense-tracker/
  package.json          "type": "module", nothing else
  server.js             Node.js server: serves public/ and the /api/expenses API, saves to data/
  check-api.js          sends the same requests as the page and prints each answer
  data/
    expenses.json       the stored expenses (only the server reads and writes it)
  public/               everything the browser may load
    index.html          the page frame: summary, add form, filter, list
    styles.css          the page's look
    app.js              state, render() and the event listeners
    api.js              every fetch call to the server
    expenses.js         validation and pure list functions, shared with server.js
    format.js           money and percent formatting
  steps/                the tracker after earlier lessons (see the lesson map)
```

## Lesson map

Each folder in `steps/` is complete on its own. Open a terminal in the folder and run the command shown.

| Step folder | Lesson | What changes | Run it |
|---|---|---|---|
| `steps/01-setup` | Setup | The first tracker: three `const` values in dollars, printed with `console.log` | `node tracker.js` |
| `steps/02-values-variables-and-types` | Values, Variables and Types | Money is stored in whole cents, with `let` for the running total | `node tracker.js` |
| `steps/06-functions` | Functions | The repeated code becomes `formatCents`, `percentOfBudget`, `sumCents` and `budgetStatus` | `node tracker.js` |
| `steps/07-arrays-and-array-methods` | Arrays and Array Methods | The expenses become an array of objects; `filter`, `map` and `reduce` total the food spending | `node list.js`, `node pipeline.js` |
| `steps/09-scope-and-closures` | Scope and Closures | `createTracker` keeps its expenses private in a closure | `node create-tracker.js` |
| `steps/10-this-classes-and-prototypes` | this, Classes and Prototypes | The same tracker as the `ExpenseTracker` class with a private `#expenses` field | `node class.js` |
| `steps/11-errors-and-debugging` | Errors and Debugging | `ValidationError` and `validateExpense` check every field of an expense | `node validation.js` |
| `steps/12-modules` | Modules | The tracker becomes a project: `src/format.js`, `src/expenses.js`, `src/main.js` and `data/expenses.json` | `node src/main.js` |
| `steps/14-async-await-and-fetch` | Async/Await and Fetch | Adds a small API server (`server.js`), a fetch module (`api.js`) and a client (`client.js`); new expenses live only in memory | `node server.js`, then in a second terminal `node client.js` |
| `steps/15-json-and-dates` | JSON and Dates | Adds `src/storage.js`, which loads and saves the expenses as JSON, and `save-load.js`, which uses it | `node save-load.js` |
| root of the repository | Capstone | The browser page, and a server that also deletes, saves to the file and serves `public/` | see Run the app |

Lessons 3, 4, 5, 8, 13 and 16 teach with separate small examples and do not change the tracker, so they have no step folder. The finished app at the root is the browser page that lesson 16 prepares for.

`save-load.js` in `steps/15-json-and-dates` adds Lunch to `data/expenses.json` every time you run it. Run `git checkout -- steps/15-json-and-dates/data/expenses.json` from the repository root to reset it.

## Troubleshooting

- **`Error: listen EADDRINUSE: address already in use :::4400`.** Another program, often a server from an earlier lesson that is still running, uses port 4400. Stop it with Ctrl+C in its terminal. To find it, run `netstat -ano | findstr :4400` on Windows or `lsof -i :4400` on macOS and Linux. If you need a different port, change `PORT` in `server.js` and `BASE` in `check-api.js` to the same number.
- **The page is empty and nothing happens.** You opened `index.html` by double-clicking it, so the address starts with `file://`. Browsers do not load modules from files; the console (F12) shows a CORS error for `app.js`. Start `node server.js` and open http://localhost:4400/ instead.
- **The status line says `Could not load expenses (... is not valid JSON). Is the server running?`.** The page was served by something other than `server.js`, such as an editor's live preview or the static server from lesson 16, which has no `/api/expenses`. Stop that server and use `node server.js`.
- **The page says `Could not load expenses (Body must be valid JSON)` although you sent no body.** `data/expenses.json` is not valid JSON any more, often after editing it by hand. Reading the file throws a `SyntaxError`, and the server's error handler answers every `SyntaxError` with that message and status 400 (the terminal shows `GET /api/expenses 400`). Fix the file or restore it with `git checkout -- data/expenses.json`.
- **`fetch failed` with `ECONNREFUSED` when you run `check-api.js` or `client.js`.** The server is not running, or it runs in a different folder. Start `node server.js` in a second terminal first and leave it open.

## License

Copyright (C) 2026 SypherNext

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). You may
use, study and change it. If you share a modified version, or run one as a website or service
that other people use, you must make your full modified source code available under the same
license. See [LICENSE](LICENSE) for the full terms.

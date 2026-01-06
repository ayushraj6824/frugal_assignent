# Frugal Assignment

A small frontend project with Playwright tests demonstrating a simple registration flow.

## Contents
- `index.html`, `script.js`, `style.css` — demo web page and client script/styles
- `tests/` — Playwright test(s) (example: `registration.spec.js`)
- `playwright.config.js` — Playwright configuration
- `playwright-report/` — generated test reports
- `package.json` — project scripts and dependencies

## Setup
1. Install dependencies:

```bash
npm install
```

2. (Optional) If you want to run the demo in a static server, you can use any static server. Example with `http-server`:

```bash
npx http-server -c-1 .
```

Open `http://localhost:8080` (or the port shown) to view the page.

## Run Playwright tests

Run tests:

```bash
npx playwright test
```

Generate and open the HTML report after tests:

```bash
npx playwright show-report
# or open playwright-report/index.html in your browser
```

## Project Structure

- `index.html` — main demo page
- `script.js` — client-side JS used by the demo
- `style.css` — demo styles
- `tests/registration.spec.js` — example Playwright spec for registration
- `playwright.config.js` — configuration for Playwright

## Notes & Next Steps
- Update `tests/` to add more end-to-end scenarios.
- Add CI job to run `npx playwright test` on PRs.
- Add a short CONTRIBUTING.md if others will contribute.

## License
Use or adapt as you like — add a license file if required.

# Playwright E2E Login Test Suite

This container includes a Playwright-based end-to-end (E2E) test suite that validates login behavior for:

- https://the-internet.herokuapp.com/login

## What’s included

- Playwright configuration: `playwright.config.js`
- Page Object Model (POM):
  - `playwright/pages/LoginPage.js`
  - `playwright/pages/loginPage.selectors.js`
- Test data (JSON): `playwright/test-data/login.users.json`
- Tests:
  - `playwright/tests/login.spec.js`
- Utilities:
  - `playwright/utils/testData.js`
  - `playwright/utils/testMeta.js`

## Install

From `playwright_test_runner/`:

```bash
npm install
npm run e2e:install
```

`e2e:install` installs Playwright browsers (and OS deps in Linux via `--with-deps`).

## Run tests

```bash
npm run e2e
```

Open the HTML report after a run:

```bash
npm run e2e:report
```

Run with the interactive UI runner:

```bash
npm run e2e:ui
```

## Configuration

The suite uses an environment variable to control the target base URL:

- `E2E_BASE_URL` (optional)
  - Default: `https://the-internet.herokuapp.com`

Example:

```bash
E2E_BASE_URL=https://the-internet.herokuapp.com npm run e2e
```

## Extending the suite

1. Add selectors in `playwright/pages/<page>.selectors.js`
2. Add page methods in `playwright/pages/<Page>.js`
3. Add/extend JSON data under `playwright/test-data/`
4. Add new spec files under `playwright/tests/`

## Notes

- Artifacts (trace/screenshot/video) are retained on failure to make debugging easy.
- Retries are enabled automatically in CI (`CI=true`).

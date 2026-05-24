

Generate complete, production-ready Playwright `.spec.ts` test files that strictly conform to the project architecture defined in `.claude/rules/`.

## Governing rules (read before generating)

Before writing a single line, load and apply all three rule files:

1. `.claude/rules/playwright-architecture.md` — PageManager contract, fixture system, test boundaries
2. `.claude/rules/playwright-ui-automation.md` — navigation rules, locator restrictions, forbidden patterns
3. `.claude/rules/playwright-scripting.md` — locator priority, assertion rules, waiting rules, anti-patterns

Any generated code that violates these rules is invalid and must be regenerated.

---
## Mode Control

This skill supports execution modes:

- AUTO MODE (default): full pipeline execution (analysis + generation)
- PLAN MODE: analysis only, no code output
- EXPLICIT MODE: generation only when requested

AUTO MODE is triggered by:
- "auto"
- "auto mode"
- "generate full tests"
- "create test file"

If no mode is specified → AUTO MODE is used.

## Hard requirements (non-negotiable)

### Architecture
- All test interaction MUST go through `PageManager` — never through direct page object instantiation
- Every test MUST receive `PageManager` via a named fixture: `{ loginPage }`, `{ productPage }`, `{ cartPage }`, `{ homePage }`, `{ contactPage }`
- NEVER call `page.goto()` inside a test body
- NEVER call `page.locator()` inside a test body — locators belong in page object methods
- NEVER call `page.waitForTimeout()` — use assertion-based waiting only
- NEVER import from `@playwright/test` — always import from `../test-options`
- NEVER instantiate page object classes directly: `new LoginSignUpPage(page)` is forbidden in test bodies

### Test design
For every page or feature generate:

| Category | Count | Purpose |
|----------|-------|---------|
| Happy path | 1 | Primary successful user journey, end-to-end |
| Negative tests | 1–3 | Wrong input, invalid credentials, duplicate data, boundary violations |
| Edge case | 1 | Empty fields, special characters, max length, concurrent actions |
| UI state validation | 1 | Assert all key elements visible on load — no interaction |
| Navigation test | 1 | Correct URL regex and heading visible after landing |
| Recovery / retry scenario | 1 | If applicable: error shown, user corrects input, action succeeds |

Each test must represent a distinct user intent. No two tests should cover the same user scenario.

### Imports (mandatory header — every generated file)
```typescript
import { test, expect } from '../test-options';
import { PageManager } from '../page-objects/pageManager';
import { faker } from '@faker-js/faker';
```

### PageManager usage
```typescript
// CORRECT — via fixture (primary pattern)
test('test name', async ({ productPage }) => {
    await productPage.toProductPage.someMethod();
});

// CORRECT — local pm alongside fixture (multi-section tests only)
test('test name', async ({ productPage, page }) => {
    const pm = new PageManager(page);
    await pm.toLoginPage.signUpUser(name, email);
    await productPage.toProductPage.addFirstAndSecondProductToCart();
});

// WRONG — never do this
const login = new LoginSignUpPage(page);
```

### Assertion rules
- Always `await` every `expect()` call — missing `await` makes assertions pass silently
- Use `toHaveURL(/regex/)` — never exact string URL assertions
- Use `toBeVisible()` as primary visibility assertion
- Use `toContainText()` for partial text, `toHaveText()` for exact text
- Use `toHaveScreenshot({ maxDiffPixels: 50 })` for snapshot assertions

### Test data
- Generate fresh data per test using `faker` — never share state between tests
- Always use dynamic expiry years: `String(new Date().getFullYear() + 2)`
- If a test creates an account, it MUST delete it before finishing

---

## Pre-generation checklist

Run through this before writing any test:

1. **Target fixture** — which fixture matches the page being tested? (`loginPage` / `productPage` / `cartPage` / `homePage` / `contactPage`)
2. **Page object methods** — do the required methods exist in the relevant page object class under `page-objects/`? If not, add them to the page object first, then write the test.
3. **Multi-section flag** — does the test touch more than one page section? If yes, create a local `pm` alongside the fixture.
4. **Data needs** — does the test create user data? Use `faker`. Does it create an account? Add a `deleteAccount()` call.
5. **Output location** — confirm the generated file path is `tests/[feature].spec.ts`

---

## Generation procedure

### Step 1 — Gather context

Ask (or infer from the codebase) the following:

- Which page or feature is being tested?
- Which fixture applies?
- What page object methods are available in `page-objects/[page]Page.ts`?
- Are there existing tests in `tests/` to avoid duplication?

### Step 2 — Plan test cases

List the tests to generate:
```
1. [Feature]: happy path — [brief description]
2. [Feature]: negative — [brief description]
3. [Feature]: negative — [brief description]
4. [Feature]: edge case — [brief description]
5. [Feature]: UI validation on load
6. [Feature]: correct URL and heading after navigation
7. [Feature]: recovery — [brief description]   ← only if applicable
```

### Step 3 — Generate the file

Write the full `.spec.ts` file. Group tests with section comments. Follow this template:

```typescript
import { test, expect } from '../test-options';
import { PageManager } from '../page-objects/pageManager';
import { faker } from '@faker-js/faker';

// ─── Happy Path ───────────────────────────────────────────────────────────────
test('[Feature]: [happy path description]', async ({ [fixture], page }) => {
    // generate data
    const name = faker.person.fullName();
    const email = faker.internet.email();

    // act via fixture → PageManager
    await [fixture].to[Page].[method](name, email);

    // assert
    await expect(page.getByText('[expected text]')).toBeVisible();
});

// ─── Negative: [reason] ───────────────────────────────────────────────────────
test('[Feature]: [negative description]', async ({ [fixture], page }) => {
    await [fixture].to[Page].[method]('[invalid input]');
    await expect(page.getByText('[error message]')).toBeVisible();
});

// ─── Edge Case ────────────────────────────────────────────────────────────────
test('[Feature]: [edge case description]', async ({ [fixture], page }) => {
    await [fixture].to[Page].[method]('');
    await expect(page.getByText('[validation message]')).toBeVisible();
});

// ─── UI State Validation ──────────────────────────────────────────────────────
test('[Feature]: key UI elements are visible on load', async ({ [fixture], page }) => {
    await expect(page.getByRole('heading', { name: '[Heading]' })).toBeVisible();
    await expect(page.getByRole('button', { name: '[Button]' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '[Field]' })).toBeVisible();
});

// ─── Navigation ───────────────────────────────────────────────────────────────
test('[Feature]: lands on correct URL with correct heading', async ({ [fixture], page }) => {
    await expect(page).toHaveURL(/[path-fragment]/);
    await expect(page.getByRole('heading', { name: '[Page Title]' })).toBeVisible();
});

// ─── Recovery ────────────────────────────────────────────────────────────────
test('[Feature]: correcting invalid input allows successful submission', async ({ [fixture], page }) => {
    // attempt with bad data
    await [fixture].to[Page].[method]('[bad input]');
    await expect(page.getByText('[error message]')).toBeVisible();
    // correct and retry
    await [fixture].to[Page].[method]('[valid input]');
    await expect(page.getByText('[success message]')).toBeVisible();
});
```

### Step 4 — Self-validate before outputting

Run through this checklist on the generated code:

```
[ ] All imports from '../test-options', not '@playwright/test'
[ ] Every test uses a named fixture parameter
[ ] No page.goto() calls in test bodies
[ ] No page.locator() calls in test bodies
[ ] No new [PageObject](page) instantiation in test bodies
[ ] No page.waitForTimeout() calls
[ ] Every expect() is prefixed with await
[ ] All URL assertions use regex: toHaveURL(/fragment/)
[ ] All faker data is generated inside the test, not at module level
[ ] Tests that create accounts delete them at the end
[ ] File path is tests/[feature].spec.ts
[ ] No duplicate test scenarios
```

If any item fails, fix the generated code before outputting.

---

## Reference examples

### Login feature — complete generated output

```typescript
import { test, expect } from '../test-options';
import { PageManager } from '../page-objects/pageManager';
import { faker } from '@faker-js/faker';

// ─── Happy Path ───────────────────────────────────────────────────────────────
test('Login: successful login with valid credentials logs user in', async ({ loginPage, page }) => {
    await loginPage.toLoginPage.loginExistingUser('testpp@test.com', '12345');
    await expect(page.getByText('Logged in as')).toBeVisible();
    await page.getByRole('link', { name: ' Logout' }).click();
    await expect(page).toHaveURL(/login/);
});

// ─── Negative: wrong password ─────────────────────────────────────────────────
test('Login: incorrect password shows error message', async ({ loginPage, page }) => {
    await loginPage.toLoginPage.loginExistingUser('testpp@test.com', 'wrongpassword');
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
});

// ─── Negative: duplicate signup email ────────────────────────────────────────
test('Login: registering with an existing email shows error', async ({ loginPage, page }) => {
    await loginPage.toLoginPage.signUpUser('AnyName', 'test@test.com');
    await expect(page.getByText('Email Address already exist!')).toBeVisible();
});

// ─── Edge Case: full registration and account deletion ────────────────────────
test('Login: register new account and delete it on completion', async ({ loginPage, page }) => {
    const pm = new PageManager(page);
    const email = faker.internet.email();
    const name = faker.person.fullName();
    const password = faker.internet.password();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const company = faker.company.name();
    const address1 = faker.location.streetAddress();
    const address2 = faker.location.secondaryAddress();
    const state = faker.location.state();
    const city = faker.location.city();
    const zip = faker.location.zipCode();
    const mobile = `+1${faker.string.numeric(10)}`;

    await pm.toLoginPage.signUpUser(firstName, email);
    await pm.toLoginPage.signUpForm(
        name, email, password, firstName, lastName,
        company, address1, address2, state, city, zip, mobile
    );
    await pm.toLoginPage.deleteAccount();
    await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible();
});

// ─── UI State Validation ──────────────────────────────────────────────────────
test('Login: all key form elements are visible on page load', async ({ loginPage, page }) => {
    await expect(page.getByText('Login to your account')).toBeVisible();
    await expect(page.getByText('New User Signup!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Signup' })).toBeVisible();
});

// ─── Navigation ───────────────────────────────────────────────────────────────
test('Login: page loads at correct URL with login and signup sections', async ({ loginPage, page }) => {
    await expect(page).toHaveURL(/login/);
    await expect(page.getByText('Login to your account')).toBeVisible();
    await expect(page.getByText('New User Signup!')).toBeVisible();
});

// ─── Recovery ────────────────────────────────────────────────────────────────
test('Login: after failed login user can correct credentials and succeed', async ({ loginPage, page }) => {
    await loginPage.toLoginPage.loginExistingUser('testpp@test.com', 'badpassword');
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();

    await loginPage.toLoginPage.loginExistingUser('testpp@test.com', '12345');
    await expect(page.getByText('Logged in as')).toBeVisible();
});
```

---

## What this skill must NEVER generate

```typescript
// All of the following are rule violations — never output them

await page.goto('/any-path');                              // ← forbidden navigation
const el = page.locator('.some-class');                   // ← raw locator in test
const login = new LoginSignUpPage(page);                   // ← direct instantiation
import { test } from '@playwright/test';                  // ← wrong import source
await page.waitForTimeout(3000);                          // ← arbitrary wait
expect(el).toBeVisible();                                 // ← missing await
await expect(page).toHaveURL('https://example.com/path'); // ← exact URL string
```

---

## Page object method gaps

If a test requires an action that has no corresponding page object method:

1. Add the method to the correct class in `page-objects/[page]Page.ts`
2. Register the class in `page-objects/pageManager.ts` if it is a new page
3. Add a fixture in `test-options.ts` if the page needs dedicated navigation setup
4. Then write the test — never inline raw Playwright calls to work around a missing method

---

## Output contract

- One `.spec.ts` file per feature domain
- File location: `tests/[feature].spec.ts`
- All tests in the file use the same base fixture where possible
- Multi-section tests declare a local `pm` alongside the fixture
- Section comments (`// ─── Category ───`) separate each test group

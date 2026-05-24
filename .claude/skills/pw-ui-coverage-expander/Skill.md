
Expands existing Playwright `.spec.ts` test files by adding missing test coverage while strictly following the existing Playwright framework architecture.

## Governing Rules

This skill enforces all rules from:
- `.claude/rules/playwright-architecture.md`
- `.claude/rules/playwright-ui-automation.md`
- `.claude/rules/playwright-scripting.md`

These rules are **non-negotiable**. Any generated test that violates them must be rejected and rewritten.

---

## What This Skill Does

- Reads and analyzes the target `.spec.ts` file before generating anything
- Identifies existing coverage and detects what is missing
- Adds **only new** test blocks — never rewrites, removes, or modifies existing tests
- Outputs new test blocks grouped by coverage category with section headers

---

## Step-by-Step Execution

### Step 1 — Read and Understand the Target File

Before generating any test:
1. Read the full `.spec.ts` file
2. Read the corresponding page object(s) used in the file
3. Identify all test titles and scenarios already covered
4. List the fixtures and PageManager methods in use

### Step 2 — Detect Missing Coverage
Before generating tests, compare against existing test titles AND underlying user intent. Do not create semantically equivalent tests even if phrasing differs.

Check for gaps in these categories:


| Category | What to look for |
|---|---|
| **UI state validation** | Initial page load, empty states, logged-in vs logged-out views |
| **Negative scenarios** | Invalid inputs, unauthorized access, failed operations |
| **Edge cases** | Empty fields, max-length inputs, special characters, boundary values |
| **Navigation correctness** | URL validation, heading/title validation after navigation |
| **Recovery flows** | Error → correction → success path |

### Step 3 — Map Missing Tests to Existing Page Object Methods

For each missing scenario:
1. Identify which `PageManager` getter provides access to the relevant page object (`pm.toLoginPage`, `pm.toProductPage`, etc.)
2. Identify which method handles the action
3. If no method exists → **do not bypass the architecture**. Flag that the method must be added to the page object first.

### Step 4 — Generate New Tests

Output only new `test(...)` blocks. Group them under clearly labeled comments:

```typescript
// ── UI State Tests ────────────────────────────────────────────────────────────

test('...', async ({ fixtureName }) => { ... });

// ── Negative Scenarios ───────────────────────────────────────────────────────

test('...', async ({ fixtureName }) => { ... });

// ── Edge Cases ───────────────────────────────────────────────────────────────

test('...', async ({ fixtureName }) => { ... });

// ── Navigation Correctness ───────────────────────────────────────────────────

test('...', async ({ fixtureName }) => { ... });

// ── Recovery Flows ───────────────────────────────────────────────────────────

test('...', async ({ fixtureName }) => { ... });
```

---

## Hard Constraints (Non-Negotiable)

### Imports
```typescript
// CORRECT
import { test, expect } from '../test-options';

// WRONG — never do this
import { test, expect } from '@playwright/test';
```

### Fixture Usage
```typescript
// CORRECT — use the named fixture
test('...', async ({ loginPage }) => {
  const pm = loginPage;
  await pm.toLoginPage.someMethod();
});

// WRONG — never use raw page
test('...', async ({ page }) => { ... });
```

### Navigation

- Navigation must only use methods defined in `NavigationPage` in the actual codebase.
- Navigation methods must be validated against NavigationPage implementation before use. If uncertain, do not generate navigation calls.
- Do NOT assume page-specific navigation methods exist unless confirmed in the project.

```typescript
// CORRECT — only if this method exists in NavigationPage
await pm.navigateTo.<existingNavigationMethod>();

// WRONG — never call page.goto() inside a test
await page.goto('https://...');
```

### Locators
```typescript
// CORRECT — all locator logic lives in page object methods
await pm.toLoginPage.loginExistingUser(email, password);

// WRONG — never use locators in test bodies
await page.locator('#email').fill(email);
```

### Assertions
- Always `await expect(...)`
- Assertions must be performed on:
  - Locators explicitly returned by PageObject methods (if defined in codebase)
  - OR direct Playwright page locators only when no PageObject abstraction exists yet
- NEVER assume PageObject methods return locators unless explicitly defined in the codebase

### Page Object Instantiation
```typescript
// CORRECT
const pm = new PageManager(page); // only when multi-section test needs it

// WRONG — never instantiate page objects directly
const login = new LoginSignUpPage(page);
```

### Test Data
- Use `faker` for any dynamic test data (names, emails, passwords, messages)
- Never hardcode personal data or credentials
- For scenarios requiring a pre-existing account, document the dependency clearly in a comment

### Test Independence
- Every test must be independently runnable
- No test may depend on state set by another test
- Clean up any created data (e.g., delete account after sign-up tests)

---

## Missing Page Object Method Protocol

If a scenario requires an action that has no corresponding method in the page object:

1. Do not use `page.locator()`, `page.fill()`, or any raw Playwright call in the test body
2. Do not skip the scenario silently
3. Do not assume PageObject methods exist based on naming patterns
4. Only use methods confirmed in the codebase
5. If a required method is missing, explicitly flag it for implementation — do not generate it
6. Do not generate PageObject methods inside this skill
7. Do not modify architecture — only report missing methods

Do:

    // ⚠️ MISSING PAGE OBJECT METHOD — implement before enabling this test
    test.skip('...', async ({ loginPage }) => {
      const pm = loginPage;
    })

---

## Output Format Rules

- Output **only** new test blocks (not a full file rewrite unless the user explicitly requests it)
- Always include section header comments
- Each test must represent a **unique, named user intent**
- Match the indentation and style of the existing file
- Do not duplicate any test scenario already present in the file

---

## Example Output

```typescript
// ── Negative Scenarios ───────────────────────────────────────────────────────

test('should show error when logging in with unregistered email', async ({ loginPage }) => {
  const pm = loginPage;
  await pm.toLoginPage.loginExistingUser('notregistered@test.com', 'WrongPass1!');
  await expect(pm.toLoginPage.loginErrorMessage()).toBeVisible();
});

// ── Edge Cases ───────────────────────────────────────────────────────────────

test('should reject signup with email missing @ symbol', async ({ loginPage }) => {
  const pm = loginPage;
  await pm.toLoginPage.signUpForm('Test User', 'invalidemail.com');
  await expect(pm.toLoginPage.signUpErrorMessage()).toBeVisible();
});
```

---

## Activation

Invoke this skill when the user asks to:
- "expand test coverage for `<file>.spec.ts`"
- "add missing tests to `<feature>` spec"
- "find coverage gaps in `<spec file>`"
- "what tests are we missing in `<file>`"

Always read the target file **first** before generating any output.

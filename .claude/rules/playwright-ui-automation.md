---
description: Playwright UI automation rules enforcing fixture-based navigation, PageManager-only interactions, strict locator hierarchy, and stable end-to-end testing practices
paths: [tests/**, page-objects/**]
---


# Playwright UI Automation Rules

## 1. Navigation — Fixtures Only

Navigation to a page section must happen through the fixture system. Never call `page.goto()` inside a test body.

```typescript
// CORRECT — fixture handles navigation
test('Search Product', async ({ productPage }) => {
    await productPage.toProductPage.searchProduct('Tshirt');
});

// WRONG — raw goto inside test
test('Search Product', async ({ page }) => {
    await page.goto('https://automationexercise.com/products');
});
```

Secondary navigation (after initial fixture load) may use:
- pm.navigateTo.<method>() only when PageManager is explicitly required
- otherwise prefer switching to another fixture

## 2. Locator Restrictions

### Allowed locators (in order of preference)
1. `getByRole()` — first choice always
2. `getByText()` — for visible text content
3. `getByLabel()` — for form fields with associated labels
4. `getByPlaceholder()` — for inputs without labels
5. `getByTestId()` — when `data-testid` attributes exist
6. `locator('css')` — only when semantic locators cannot target the element

### Forbidden in test files
- `page.locator()` called directly in test bodies (belongs in page objects only)
- `page.$()` or `page.$$()` — deprecated query selectors
- XPath locators — fragile and unreadable
- Index-based locators like `.nth(0)` without a meaningful fallback comment

## 3. Forbidden Patterns

```typescript
// NEVER — page.goto in test body
await page.goto('/products');

// NEVER — raw page.locator in test body
const btn = page.locator('.add-to-cart-btn');

// NEVER — hardcoded URLs
await expect(page).toHaveURL('https://automationexercise.com/products');
// Use regex instead:
await expect(page).toHaveURL(/products/);

// NEVER — sleep / arbitrary waits
await page.waitForTimeout(3000);

// NEVER — direct page object instantiation in tests
const lp = new LoginSignUpPage(page);

// NEVER — importing from @playwright/test in test files
import { test } from '@playwright/test';
```

## 4. PageManager Enforcement

Every test must receive a `PageManager` through the fixture. The pattern is:

```typescript
test('My Test', async ({ productPage }) => {
    // productPage is a fixture-provided PageManager instance scoped to product flows
    // Use it as the primary entry point for product-related actions

    await productPage.toProductPage.someMethod();
});
```

When a test spans multiple sections:
```typescript
test('Register, Login and Place Order', async ({ productPage, loginPage }) => {
    await loginPage.toLoginPage.signUpUser(name, email);
    await productPage.toProductPage.addFirstAndSecondProductToCart();
});
```

## 5. Test Isolation Rules

- Each test must be fully independent; no test should depend on state left by another
- All test data must be generated fresh per test (use `@faker-js/faker`)
- If a test creates an account, it must delete it before finishing
- Never share mutable state through module-level variables between tests

```typescript
// CORRECT — fresh data per test
const randomEmail = faker.internet.email();
const randomName = faker.person.fullName();
```

## 6. Stability Rules

- Always use semantic assertions, not `waitForTimeout`
- Assert the element state before interacting when the element might not be immediately ready
- Use `scrollIntoViewIfNeeded()` before clicking off-screen elements
- Use regex URL assertions instead of exact string matches for URL checks
- Hover-triggered elements must be hovered before their child is accessed

```typescript
// CORRECT — assertion-based wait
await expect(button).toBeVisible();
await button.click();

// CORRECT — regex URL check
await expect(page).toHaveURL(/view_cart/);

// CORRECT — hover before accessing child
await product.hover();
const addBtn = product.getByText('Add to cart').first();
await addBtn.click();
```

## 7. Ad Blocking

Ad blocking is applied automatically by every fixture via `blockAdsBeforeLoad()`. Never add ad-blocking logic inside a test body or page object — it is infrastructure, not test logic.

## 8. Screenshot Assertions

Snapshot tests require generated baseline files:
- Run `npx playwright test --update-snapshots` on a new machine first
- Commit snapshot files from `tests/login.spec.ts-snapshots/` and `tests/product.spec.ts-snapshots/`
- Use `maxDiffPixels: 150` for per-element snapshots (already set in `loginSignUpPage.ts`)

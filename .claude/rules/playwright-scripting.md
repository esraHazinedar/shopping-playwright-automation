---
description: Playwright locator, assertion, waiting, and best-practice rules for stable UI automation using PageManager architecture
paths: [tests/**, page-objects/**]
---

# Playwright Scripting Rules

## 1. Locator Strategy (Priority Order)

Always pick the highest-priority locator that uniquely identifies the element.

### Priority 1 — `getByRole()`
Use for interactive elements (buttons, links, inputs, headings).

```typescript
page.getByRole('button', { name: 'Add to cart' })
page.getByRole('link', { name: 'Logout' })
page.getByRole('heading', { name: 'All Products' })
page.getByRole('textbox', { name: 'Email Address' })
```

### Priority 2 — `getByText()`
Use for non-interactive elements containing visible text.

```typescript
page.getByText('Logged in as')
page.getByText('ACCOUNT CREATED!')
```

### Priority 3 — `getByLabel()`
Use for form inputs with `<label>` associations.

```typescript
page.getByLabel('Name')
page.getByLabel('Password')
```

### Priority 4 — `getByPlaceholder()`
Use for inputs whose only identifier is placeholder text.

```typescript
page.getByPlaceholder('Search Product')
```

### Priority 5 — `getByTestId()`
Use when `data-testid` attributes exist on elements.

```typescript
page.getByTestId('add-to-cart')
```

### Priority 6 — `locator()` with CSS
Use only when no semantic locator can target the element.

```typescript
// Acceptable — specific structural selector
page.locator('.modal-content a[href="/view_cart"]')

// Avoid — overly broad
page.locator('div > span')
```

### Never Use
- `page.$()` / `page.$$()` — deprecated
- XPath: `page.locator('//div[@class="foo"]')`
- Positional index alone: `page.locator('button').nth(2)` without comment

## 2. Assertion Rules

### Use `expect()` from `../test-options`, not `@playwright/test`

```typescript
import { test, expect } from '../test-options';
```

### Always `await` assertions

```typescript
// CORRECT
await expect(page.getByText('ACCOUNT CREATED!')).toBeVisible();

// WRONG — missing await, assertion runs without waiting
expect(page.getByText('ACCOUNT CREATED!')).toBeVisible();
```

### Preferred assertion methods

| Scenario                    | Assertion                                  |
|-----------------------------|--------------------------------------------|
| Element visible             | `toBeVisible()`                            |
| Element not visible         | `toBeHidden()`                             |
| URL match                   | `toHaveURL(/regex/)` — prefer regex        |
| Text content                | `toHaveText()` or `toContainText()`        |
| Input value                 | `toHaveValue()`                            |
| Count                       | `toHaveCount()`                            |
| Screenshot                  | `toHaveScreenshot({ maxDiffPixels: 50 })`  |

### Extended timeout for legitimately slow assertions

```typescript
// Only when the wait is genuinely needed
await expect(element).toBeVisible({ timeout: 10000 });
```

### Never assert exact URLs with strings

```typescript
// WRONG
await expect(page).toHaveURL('https://automationexercise.com/login');

// CORRECT
await expect(page).toHaveURL(/login/);
```

## 3. Waiting Rules

**Never use `page.waitForTimeout()`** — it creates flaky tests and wastes time.

Instead, use assertion-based waiting:

```typescript
// CORRECT — waits until visible, up to expect.timeout
await expect(element).toBeVisible();
await element.click();

// CORRECT — explicit wait for specific state
await element.waitFor({ state: 'visible', timeout: 8000 });

// WRONG — hardcoded sleep
await page.waitForTimeout(3000);
```

When an element appears after an async operation (API call, animation), assert its expected state before interacting — Playwright's auto-waiting covers most cases automatically.

## 4. Best Practices

### Generate test data with faker

```typescript
import { faker } from '@faker-js/faker';
const email = faker.internet.email();
const name = faker.person.fullName();
```

### Scope locators to containers

```typescript
// More resilient — scoped to container
const products = page.locator('.features_items .col-sm-4');
const first = products.first();
await first.hover();
await first.getByText('Add to cart').first().click();
```

### Dynamic values over hardcoded ones

```typescript
// CORRECT — dynamic expiry year
String(new Date().getFullYear() + 2)

// WRONG — hardcoded year
'2025'
```

### Hover before clicking hover-triggered buttons

```typescript
await productCard.hover();
await productCard.getByText('Add to cart').first().click();
```

### Screenshot on specific elements, not full page, for modal interactions

```typescript
await viewCartButton.screenshot({ path: 'screenshots/viewcartButton.png' });
```

## 5. Anti-Patterns

| Anti-Pattern                            | Why Forbidden                              | Correct Alternative                        |
|-----------------------------------------|--------------------------------------------|--------------------------------------------|
| `page.waitForTimeout(ms)`               | Flaky, slow                                | `await expect(el).toBeVisible()`           |
| `page.goto()` in test body              | Bypasses fixture navigation contract       | Use fixture or `pm.navigateTo.<method>()`  |
| `new LoginSignUpPage(page)` in test     | Bypasses PageManager                       | `pm.toLoginPage.<method>()`                |
| Hardcoded base URL in assertion         | Breaks cross-environment runs              | `toHaveURL(/path-fragment/)`               |
| `import { test } from '@playwright/test'` | Misses ad-blocker and fixtures           | `import { test } from '../test-options'`   |
| Missing `await` on `expect()`           | Assertion runs synchronously, always passes| Always prefix with `await`                 |
| XPath locators                          | Fragile, tightly coupled to DOM structure  | Semantic locators (`getByRole`, etc.)      |
| Storing locators in class properties    | Stale references across navigations        | Declare locators inside each method        |
| Hardcoded expiry years in payment forms | Fails after the year passes                | `new Date().getFullYear() + 2`             |
| Chaining `.nth(0)` without context      | Selects wrong element when DOM shifts      | Scope to container first                   |

## Rule Scope

This file ONLY governs:
- Locator strategy
- Assertion rules
- Waiting rules
- Test writing best practices

It does NOT define:
- PageManager structure (see architecture rules)
- Navigation behavior (see UI automation rules)
- Test generation logic (see skills)

---
name: playwright-architecture
description: Defines PageManager, fixtures, and Playwright testing architecture rules
paths: [tests/**, playwright-utils/**, playwright.config.ts]
---

# Playwright Architecture Rules

## 1. PageManager Is the Only Entry Point

All test interaction MUST go through `PageManager`. Tests must never instantiate page object classes directly.

```typescript
// CORRECT
const pm = new PageManager(page);
await pm.toLoginPage.loginExistingUser(email, password);

// WRONG — never do this
const login = new LoginSignUpPage(page);
```

`PageManager` lives in `page-objects/pageManager.ts` and exposes all page objects via getters:

| Getter              | Class             | Responsibility                          |
|---------------------|-------------------|-----------------------------------------|
| `pm.navigateTo`     | NavigationPage    | Nav bar link clicks                     |
| `pm.toHomePage`     | HomePage          | Home page interactions                  |
| `pm.toLoginPage`    | LoginSignUpPage   | signUpUser, signUpForm, login, delete   |
| `pm.toProductPage`  | ProductPage       | Product listing, detail, cart actions   |
| `pm.toCartPage`     | CartPage          | Cart view and checkout flow             |
| `pm.toContactPage`  | ContactPage       | Contact form submission                 |

## 2. Fixture System

All tests receive a `PageManager` through a named fixture, never through a bare `page` object.

Available fixtures (defined in `test-options.ts`):

| Fixture       | Navigates To         | Blocks Ads |
|---------------|----------------------|------------|
| `loginPage`   | Login/Signup page    | Yes        |
| `homePage`    | Home page            | Yes        |
| `productPage` | Products page        | Yes        |
| `cartPage`    | Cart page            | Yes        |
| `contactPage` | Contact page         | Yes        |

Each fixture:
1. Creates `new PageManager(page)`
2. Calls `blockAdsBeforeLoad(page)` before any navigation
3. Navigates via `pm.navigateTo.<method>()`
4. Yields the `PageManager` to the test

**Import rule:** Always import `test` and `expect` from `../test-options`, never from `@playwright/test`.

```typescript
// CORRECT
import { test, expect } from '../test-options';

// WRONG
import { test, expect } from '@playwright/test';
```

## 3. Test Boundaries

- One test file per feature domain (e.g., `login.spec.ts`, `product.spec.ts`)
- Each test must use exactly one fixture that matches the domain
- When a test spans multiple page sections, create a local `new PageManager(page)` alongside the fixture
- Test files live in `tests/`
- Page object files live in `page-objects/`

## 4. Page Object Rules

- Each page object class takes `readonly page: Page` in its constructor
- All interaction methods are `async`
- Locators are declared inline inside methods — no stored locator properties
- Page objects never navigate themselves; navigation belongs to `NavigationPage`
- Page objects never make assertions beyond verifying preconditions for their own actions

## 5. Adding a New Page Object

1. Create class in `page-objects/` following existing class structure
2. Add it to `PageManager`'s constructor and expose via a getter
3. Add a corresponding fixture in `test-options.ts` if the page needs dedicated setup
4. Never skip step 2 — page objects not in `PageManager` cannot be used by tests

## 6. Configuration Contract

| Setting              | Value                        |
|----------------------|------------------------------|
| `retries`            | 1 (local), 2 (CI)            |
| `workers`            | 4 (local), 1 (CI)            |
| `expect.timeout`     | 2000 ms                      |
| `video`              | always on                    |
| `trace`              | always on                    |
| `maxDiffPixels`      | 50 (global), 150 (per-element)|

- `globalsQaURL` reads `testInfo.project.use.baseURL` at runtime; never hardcode URLs in tests
- Projects: `chromium` (default), `prod` (Firefox), `productFullScreen` (1920×1080, contact only), `mobile` (iPhone 13 Pro, 400×800)

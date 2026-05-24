# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all tests (chromium by default)
npx playwright test

# Run a single test file on a specific project
npx playwright test login.spec.ts --project=chromium
npx playwright test product.spec.ts --project=prod       # Firefox
npx playwright test contact.spec.ts --project=productFullScreen

# Run a single test by title
npx playwright test --grep "Register a new user"

# npm shortcuts
npm run login:prod       # login suite on Firefox
npm run product:prod     # product suite on Firefox
npm run home:prod
npm run contact:prod
npm run cart:chrome
npm run cart-all         # cart suite on Chrome + Firefox sequentially

# Open HTML report after a run
npx playwright show-report

# Run with Allure reporter
npm run test:allure

# Performance tests (requires JMeter on PATH)
npm run test:performance

# Docker (runs product:prod inside container, mounts reports to host)
docker-compose up --build
```

## Architecture

### Entry point for every test

All tests import `test` and `expect` from `../test-options` (not directly from `@playwright/test`). `test-options.ts` extends the base fixture with:

- **Ad blocker** — `blockAdsBeforeLoad()` intercepts all routes and aborts ad network requests (doubleclick.net, adservice.google.com, etc.) before any navigation happens.
- **Per-section fixtures** — `loginPage`, `homePage`, `productPage`, `cartPage`, `contactPage`. Each fixture creates a `PageManager`, blocks ads, navigates to the section, then yields the `PageManager`.
- **`globalsQaURL`** — reads `testInfo.project.use.baseURL` at runtime so each browser project gets its own base URL without hardcoding.

### PageManager pattern

`PageManager` is the only class tests should interact with directly. It instantiates all page objects in its constructor and exposes them via getters:

```typescript
pm.navigateTo      // NavigationPage  — nav bar clicks
pm.toHomePage      // HomePage
pm.toLoginPage     // LoginSignUpPage — signUpUser, signUpForm, loginExistingUser, deleteAccount
pm.toProductPage   // ProductPage
pm.toCartPage      // CartPage
pm.toContactPage   // ContactPage
```

Tests receive a `PageManager` through fixtures (e.g., `{ loginPage }`). When a test needs page objects from multiple sections it creates its own `new PageManager(page)` in addition to using the fixture.

### Adding a new test

1. Use the closest fixture (`loginPage`, `productPage`, etc.) as the parameter — it handles navigation and ad-blocking automatically.
2. Call methods through `pm.to<Page>.<method>()` rather than interacting with Playwright locators directly inside the test body.
3. If the action doesn't exist yet, add a method to the relevant page object class, not to the test file.

### Adding a new page object

1. Create a class in `page-objects/` following the existing pattern (`readonly page: Page`, constructor, async methods).
2. Instantiate it in `PageManager`'s constructor and expose it with a getter.
3. Add a corresponding fixture in `test-options.ts` if the page needs its own navigation setup.

## Key configuration notes

- `playwright.config.ts` sets `retries: 1` locally and `2` on CI; `workers: 4` locally and `1` on CI.
- Video and trace are always on — reports include full recordings without any extra flags.
- `expect.timeout` is 2 000 ms (tighter than the Playwright default). Increase per-assertion with `{ timeout }` if a specific wait is legitimately longer.
- `toMatchSnapshot` allows `maxDiffPixels: 50`; per-element snapshot assertions in `loginSignUpPage.ts` use `maxDiffPixels: 150`.
- The `mobile` project uses iPhone 13 Pro device with viewport overridden to 400×800.
- The `productFullScreen` project runs `contact.spec.ts` only at 1920×1080.

## Known issues & gotchas

**`signUpUser()` always runs a snapshot assertion** — `LoginSignUpPage.signUpUser()` calls `toHaveScreenshot()` on the name input before filling it. First run on a new machine will fail until baselines are generated with `npx playwright test --update-snapshots`. Commit the files from `tests/login.spec.ts-snapshots/`.

**Pre-existing test account is not created by any fixture** — "Login with Existing User" and "Negative Login Test" rely on `testpp@test.com` existing on the live site. If that account is deleted, those tests will fail with no obvious error. There is no automated setup that creates this account.

> The following issues have been resolved and are kept here for reference only.
> - ~~`cart:firefox` used `--project=firefox`~~ → fixed to `--project=prod`
> - ~~`webServer` block referenced missing `npm run start`~~ → removed from config
> - ~~`pageManager` fixture silently navigated to Products~~ → `productPage` dependency removed
> - ~~Missing `await` on assertions across `productPage`, `cartPage`, `contactPage`, `homePage`, `loginSignUpPage`, `login.spec.ts`~~ → all fixed
> - ~~`webkit` project had no `baseURL` override~~ → `baseURL` added

> - ~~Hardcoded expiry year `'2025'` in `product.spec.ts`~~ → now dynamic: `new Date().getFullYear() + 2`

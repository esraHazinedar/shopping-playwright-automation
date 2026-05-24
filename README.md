# Shopping Automation Project

## Overview

End-to-end test automation framework for [AutomationExercise](https://automationexercise.com) — a public e-commerce demo site. Covers functional UI testing with **Playwright** and load/performance testing with **JMeter**, with Docker support for CI execution.

---

## Tech Stack

| Layer | Tool |
|---|---|
| UI Automation | Playwright (TypeScript) |
| Performance | Apache JMeter |
| Test Data | @faker-js/faker + CSV files |
| Reporting | Playwright HTML Reporter / Allure (optional) |
| Containerisation | Docker + Docker Compose |

---

## Project Structure

```
ShoppingProject_Playwright/
├── page-objects/
│   ├── pageManager.ts        # Central access point for all page objects
│   ├── navigationPage.ts     # Nav bar actions (go to Login, Cart, Products, etc.)
│   ├── homePage.ts
│   ├── loginSignUpPage.ts    # Sign up, login, delete account flows
│   ├── productPage.ts
│   ├── cartPage.ts
│   └── contactPage.ts
├── tests/
│   ├── login.spec.ts         # Register, login, negative login, duplicate email
│   ├── product.spec.ts
│   ├── cart.spec.ts
│   ├── home.spec.ts
│   ├── contact.spec.ts
│   ├── testMobile.spec.ts
│   └── performance/
│       ├── test-plans/
│       │   └── add-to-cart.jmx
│       └── data/
│           └── products.csv
├── test-options.ts           # Custom fixtures + ad-blocker
├── playwright.config.ts
├── Dockerfile
└── docker-compose.yaml
```

---

## Architecture

### Page Object Model (POM)

All page interactions live in dedicated classes under `page-objects/`. `PageManager` wires them together and is the only class tests interact with directly:

```typescript
pm.navigateTo.navigateToLoginSignUpPage();
pm.toLoginPage.loginExistingUser(email, password);
pm.toCartPage.addToCart();
```

### Custom Fixtures (`test-options.ts`)

`base.test` is extended with per-section fixtures: `loginPage`, `homePage`, `productPage`, `cartPage`, `contactPage`. Each fixture:
1. Creates a `PageManager`
2. Blocks ad requests before any navigation (doubleclick.net, adservice.google.com, etc.)
3. Navigates to the relevant section
4. Yields the `PageManager` to the test

The `globalsQaURL` fixture reads `testInfo.project.use.baseURL` at runtime, so each browser project uses its own configured base URL automatically.

---

## Browser Projects

| Project | Browser | Viewport | Test scope |
|---|---|---|---|
| `chromium` | Desktop Chrome | 1920×1080 | All tests |
| `prod` | Desktop Firefox | 1920×1080 | All tests |
| `webkit` | Desktop Safari | default | All tests |
| `productFullScreen` | (inherits) | 1920×1080 | `contact.spec.ts` only |
| `mobile` | iPhone 13 Pro | 400×800 | testMobile, product, contact, login, home |

---

## Key Configuration

| Setting | Local | CI |
|---|---|---|
| Workers | 4 | 1 |
| Retries | 1 | 2 |
| Parallel | fully parallel | fully parallel |
| Video | always on (1920×1080) | always on |
| Trace | always on | always on |
| `actionTimeout` | 20 000 ms | 20 000 ms |
| `expect.timeout` | 2 000 ms | 2 000 ms |
| Snapshot `maxDiffPixels` | 50 | 50 |

---

## Running Tests

```bash
# Run all tests (chromium by default)
npx playwright test

# Run a specific suite on a specific project
npm run login:prod        # login suite on Firefox
npm run product:prod      # product suite on Firefox
npm run home:prod
npm run contact:prod
npm run cart:chrome

# Run all cart tests across Chrome + Firefox
npm run cart-all

# Open Playwright HTML report
npx playwright show-report
```

### Docker

```bash
# Build and run the product suite on Firefox inside a container
docker-compose up --build
```

The compose file mounts `playwright-report/` and `test-results/` so reports are available on the host after the run.

---

## Performance Testing (JMeter)

```bash
npm run test:performance
```

Runs `tests/performance/test-plans/add-to-cart.jmx` using `tests/performance/data/products.csv` for parameterisation. Results and an HTML report are written to `tests/performance/results/`.

---

## Reporting

HTML reporter is active by default (`playwright-report/index.html`).  
Allure is installed (`allure-playwright`) but currently commented out in `playwright.config.ts`. To enable:

```bash
npm run test:allure
```

---

## Testing Conventions

### Test Structure & Hierarchy

```
tests/
  login.spec.ts       → auth flows (register, login, logout, negative, duplicate email)
  product.spec.ts     → product listing, search, detail, add-to-cart, checkout + payment
  cart.spec.ts        → cart management
  home.spec.ts        → home page nav items, newsletter subscription
  contact.spec.ts     → contact form submission
  testMobile.spec.ts  → mobile-specific viewport scenarios
```

Each spec file maps to a single user-facing domain. Cross-domain flows (e.g. register → add to cart → checkout) live in `product.spec.ts` since they are product/purchase journeys.

### Fixture Usage Pattern

Always use the closest named fixture rather than navigating manually inside a test:

```typescript
// correct — fixture navigates and blocks ads for you
test('my test', async ({ loginPage }) => {
  await loginPage.toLoginPage.loginExistingUser(email, password);
});

// only create a second PageManager when you need page objects
// from a different section within the same test
test('cross-section flow', async ({ productPage, page }) => {
  const pm = new PageManager(page);
  await pm.toLoginPage.signUpUser(name, email);
});
```

### Locator Hierarchy (preferred order)

Follow this priority when writing new locators — most stable to least stable:

1. **Role-based** — `getByRole('button', { name: 'Login' })`
2. **Placeholder** — `getByPlaceholder('Email Address')`
3. **Text content** — `getByText('New User Signup!')`
4. **Stable CSS IDs** — `page.locator('#quantity')`, `page.locator('#days')`
5. **Scoped CSS** — `page.locator('.login-form').getByPlaceholder(...)` (scope to a container first)
6. **Avoid** — generic nth-child, XPath, or attribute selectors unless no alternative exists

### Project-Specific Selectors

Key selectors used across the codebase — reuse these rather than re-discovering them:

| Element | Selector |
|---|---|
| Nav bar links | `.shop-menu.pull-right ul li a` |
| Sign-up form container | `.signup-form` |
| Login form container | `.login-form` |
| Product grid | `.features_items .col-sm-4` |
| Product info text | `.productinfo.text-center p` |
| Cart rows | `.cart_info tbody tr` |
| Cart item quantity | `.cart_quantity button` |
| Cart item price | `.cart_price p` |
| Cart item total | `.cart_total p` |
| "Continue Shopping" modal button | `button[data-dismiss="modal"]` |
| "View Cart" in modal | `.modal-content a[href="/view_cart"]` |
| Proceed to Checkout | `.btn.btn-default.check_out` |
| Add to Cart (product detail) | `button[class="btn btn-default cart"]` |
| Product tabs (detail nav) | `.nav.nav-pills.nav-justified > li > a` |
| Category/brand sidebar | `#accordian`, `.brands_products` |
| Footer subscribe input | `footer .input-group input` |
| Footer submit button | `footer button[type="submit"]` |

### Test Data

Use `@faker-js/faker` for all user-generated data (names, emails, passwords, addresses). Never hardcode personal data in tests. The one exception is login tests that target a pre-existing account (`testpp@test.com` / `12345`) — this account must exist on the site for those tests to pass.

### Snapshot Testing

Element-level screenshots are taken with `toHaveScreenshot()`. The global threshold is `maxDiffPixels: 50` (config). The name input on the sign-up form uses a looser `maxDiffPixels: 150` due to font rendering variance. Snapshot baselines live in `tests/*.spec.ts-snapshots/`.

### Ad Blocking

The `blockAdsBeforeLoad()` helper in `test-options.ts` intercepts all routes before the first navigation. If a new ad network causes flakiness, add its domain to the blocklist there — do not add waits or retries in individual tests to compensate.

---

## Important Gotchas

**`expect.timeout` is only 2 000 ms.**  
The global assertion timeout is much tighter than Playwright's default (5 000 ms). Assertions that depend on a network response or a slow animation will fail here even though they would pass in a default setup. Override per-assertion with `{ timeout: 5000 }` only when the wait is genuinely justified.

**`signUpUser()` triggers a snapshot assertion internally.**  
`LoginSignUpPage.signUpUser()` calls `toHaveScreenshot()` on the name input before filling it. Any test that calls `signUpUser()` will fail on first run if no baseline snapshot exists yet. Run `npx playwright test --update-snapshots` once to generate the baseline, then commit the files from `tests/login.spec.ts-snapshots/`.

**Pre-existing test account must exist on the site.**  
`login.spec.ts` tests "Login with Existing User" and "Negative Login Test" using `testpp@test.com`. If this account is ever deleted from automationexercise.com both tests will fail with no obvious error message. There is no fixture or global setup that creates this account automatically.

---

### Fixed (previously listed as gotchas)

| Issue | Fix applied |
|---|---|
| `cart:firefox` used `--project=firefox` (wrong project name) | Changed to `--project=prod` in `package.json` |
| `webServer` block referenced missing `npm run start` | Removed from `playwright.config.ts` |
| `pageManager` fixture silently navigated to Products page | Removed `productPage` dependency from fixture in `test-options.ts` |
| Missing `await` on assertions in `productPage`, `cartPage`, `contactPage`, `homePage`, `loginSignUpPage`, `login.spec.ts` | All un-awaited `expect()` calls fixed |
| `webkit` project had no `baseURL` override | `baseURL: 'https://automationexercise.com/'` added to webkit project |
| Hardcoded expiry year `'2025'` in `product.spec.ts` | Now dynamic: `new Date().getFullYear() + 2` |

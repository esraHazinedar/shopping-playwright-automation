# Homepage Test Cases

Derived from a live exploration of `https://automationexercise.com/` on 2026-09-18
(Chrome, desktop viewport). Every test case below is grounded in an element or
behavior actually observed on the page — none are speculative. See
[`../RTM.md`](../RTM.md) for the mapping from each test case to its automated
test (or the documented reason it is intentionally not automated).

## Scope note

Per project direction, this catalog documents **every distinct user-facing
behavior found on the homepage**, but only **critical, business-relevant
actions** (checkout-path actions, primary navigation, lead-capture) are
automated. Decorative or low-risk elements (marketing carousel, scroll-to-top
button) are documented for completeness but deliberately left out of the
automated suite, with the reason stated per case.

Category and brand sidebar filtering appear identically on the homepage and
the Products page (same `#accordian` / `.brands_products` markup). They are
already automated from the Products page in `tests/product.spec.ts`, so they
are documented here for traceability but not re-automated on the homepage.

---

## Navigation

### TC-HOME-001 — All primary nav items are present
- **Type:** UI State | **Priority:** P1
- **Preconditions:** Homepage loaded
- **Steps:** Inspect the top nav bar
- **Expected:** Home, Products, Cart, Signup / Login, Test Cases, API Testing, Video Tutorials, Contact us all present and visible
- **Evidence:** Screenshot of nav bar on page load; markup `.shop-menu.pull-right ul li a`

### TC-HOME-002 — Clicking "Products" navigates to the Products page
- **Type:** Navigation | **Priority:** P1
- **Steps:** Click "Products" in the nav bar
- **Expected:** URL matches `/products`

### TC-HOME-003 — Clicking "Cart" navigates to the Cart page
- **Type:** Navigation | **Priority:** P1
- **Steps:** Click "Cart" in the nav bar
- **Expected:** URL matches `/view_cart`

### TC-HOME-004 — Clicking "Signup / Login" navigates to the Login page
- **Type:** Navigation | **Priority:** P1
- **Steps:** Click "Signup / Login" in the nav bar
- **Expected:** URL matches `/login`

### TC-HOME-005 — Clicking "Contact us" navigates to the Contact page
- **Type:** Navigation | **Priority:** P2
- **Steps:** Click "Contact us" in the nav bar
- **Expected:** URL matches `/contact_us`

### TC-HOME-006 — Clicking "Test Cases" navigates away from the homepage
- **Type:** Navigation | **Priority:** P3
- **Steps:** Click "Test Cases" in the nav bar
- **Expected:** Navigation occurs (secondary reference page, not a shopping-critical flow)

---

## Newsletter Subscription (footer)

### TC-HOME-007 — Footer subscription section visible before interaction
- **Type:** UI State | **Priority:** P2
- **Steps:** Scroll to footer
- **Expected:** "Subscription" heading visible
- **Evidence:** Screenshot of footer with `Your email address` input + submit arrow button

### TC-HOME-008 — Subscribe with a valid email succeeds
- **Type:** Happy path | **Priority:** P1
- **Steps:** Enter a valid email, click the arrow submit button
- **Expected:** "You have been successfully subscribed!" message visible

### TC-HOME-009 — Subscribe with an invalid email format
- **Type:** Negative | **Priority:** P2
- **Steps:** Enter `not-an-email`, submit
- **Expected:** Success message does not appear (browser-native email validation blocks submission)

### TC-HOME-010 — Subscribe with an empty email field
- **Type:** Edge case | **Priority:** P2
- **Steps:** Submit with the field empty
- **Expected:** Success message does not appear

### TC-HOME-011 — Recovery: correcting an invalid email allows successful subscription
- **Type:** Recovery | **Priority:** P2
- **Steps:** Enter invalid text, clear, enter a valid email, submit
- **Expected:** Success message appears after correction

---

## Product Discovery — Features Items

### TC-HOME-012 — Features Items section visible on load
- **Type:** UI State | **Priority:** P2
- **Steps:** Load homepage
- **Expected:** "Features Items" heading visible with a populated product grid
- **Evidence:** Screenshot; markup `.features_items`

### TC-HOME-013 — Add to Cart from Features Items, then View Cart
- **Type:** Happy path | **Priority:** P1 (critical e-commerce action)
- **Steps:** Click "Add to cart" on the first product in the Features Items grid; in the confirmation modal click "View Cart"
- **Expected:** "Added!" modal appears with "View Cart" and "Continue Shopping" options; clicking "View Cart" navigates to `/view_cart` and the added product row is visible
- **Evidence:** Live click on "Blue Top" (Rs. 500, product id 1) produced the modal exactly as described (screenshot captured during exploration)
- **Note:** Distinct DOM component (`.features_items .add-to-cart`) from the already-automated Recommended Items add-to-cart (`.recommended_items .add-to-cart`) — not a duplicate.

### TC-HOME-014 — Add to Cart from Features Items, then Continue Shopping
- **Type:** Happy path (alternate outcome) | **Priority:** P2
- **Steps:** Click "Add to cart" on the first product in the Features Items grid; in the confirmation modal click "Continue Shopping"
- **Expected:** Modal closes, user remains on the homepage
- **Note:** This path is not automated anywhere else in the repository (verified via repo-wide search — only a docstring comment references "Continue Shopping", no executable test).

### TC-HOME-015 — Recommended Items: add to cart from carousel
- **Type:** Happy path | **Priority:** P1
- **Steps:** Scroll to Recommended Items, click "Add to cart" on the first item, click "View Cart"
- **Expected:** Navigates to `/view_cart` with the item present
- **Status:** Already automated — see RTM.

### TC-HOME-022 — No broken product images in Features Items or Recommended Items
- **Type:** Negative / integrity | **Priority:** P1 (critical — a broken product image directly undermines trust and conversion)
- **Steps:** Load homepage; for every `<img>` in the Features Items grid and the Recommended Items carousel, verify the image actually loaded
- **Expected:** No image has `naturalWidth === 0` (the DOM-level signature of a broken/404 image) — checked via `img.complete` / `img.naturalWidth`, not a visual/screenshot comparison
- **Evidence:** First run flagged 6 images as broken; verified via `curl` that all 6 URLs returned HTTP 200 with real image bytes — the first implementation checked too early, before a long, eagerly-loaded image grid finished downloading. Fixed by polling (`expect(...).toPass()`) until every image's `complete` flag is true before checking `naturalWidth`.
- **Reusability:** Implemented as a shared helper, `page-objects/utils/imageAssertions.ts → verifyNoBrokenImages(images: Locator)`, callable from any page object (Products, Cart, category/brand pages) — added here for the homepage only; not yet wired into other pages.

---

## Category & Brand Browsing (sidebar)

### TC-HOME-016 — Category accordion expands to show subcategories
- **Type:** UI State | **Priority:** P3
- **Steps:** Click "Women" in the Category panel
- **Expected:** Panel expands to reveal Dress / Tops / Saree links
- **Evidence:** Live screenshot of expanded accordion

### TC-HOME-017 — Selecting a subcategory (Women > Dress) navigates to a filtered product list
- **Type:** Navigation | **Priority:** P2
- **Expected:** Navigates to `/category_products/1`, heading matches "Dress", filtered product grid loads
- **Status:** Already automated from the Products page (`#accordian` is the identical shared component) — not re-automated here. See RTM.

### TC-HOME-018 — Selecting a brand (e.g. Polo) navigates to brand-filtered products and supports add-to-cart
- **Type:** Navigation + Happy path | **Priority:** P3
- **Expected:** Navigates to brand products page; add-to-cart on first item succeeds
- **Status:** Already automated from the Products page (`.brands_products` is the identical shared component) — not re-automated here. See RTM.

---

## Explicitly NOT automated (documented for completeness)

### TC-HOME-019 — Hero carousel manual navigation (prev/next arrows, dot indicators)
- **Type:** UI State | **Priority:** P4 (low)
- **Reason not automated:** Pure marketing banner with no business logic or state to verify; content/copy changes frequently, which would make an automated check brittle and low-value relative to its maintenance cost.

### TC-HOME-020 — "Scroll to top" button returns user to page top
- **Type:** UI State | **Priority:** P4 (low)
- **Reason not automated:** Cosmetic convenience control, zero business impact if broken.

### TC-HOME-021 — Third-party ad overlays do not block core homepage interactions
- **Type:** Negative / resilience | **Priority:** P3
- **Reason not automated as a dedicated test:** Confirmed during exploration that Google Vignette and product-ad interstitials do appear on this live external site. This is already mitigated structurally by the `blockAdsBeforeLoad()` fixture applied to every test (see `test-options.ts`), rather than by a functional assertion — an explicit test would only be re-verifying third-party ad-network behavior outside this project's control.

---

## Summary

| Category | Count |
|---|---|
| Total test cases documented | 22 |
| Automated directly in `home.spec.ts` | 15 (12 existing + 3 new: TC-HOME-013, TC-HOME-014, TC-HOME-022) |
| Automated via shared component in `product.spec.ts` | 2 (TC-HOME-017, TC-HOME-018) |
| Intentionally not automated (with rationale) | 3 (TC-HOME-019, TC-HOME-020, TC-HOME-021) |
| Functional coverage (automated directly or cross-referenced) | 17 / 22 = 77% |

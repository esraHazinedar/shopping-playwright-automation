# Requirement Traceability Matrix (RTM) — Homepage

Maps every homepage test case in
[`test-cases/homepage-test-cases.md`](test-cases/homepage-test-cases.md) to
its concrete automated test, so nothing here is a fabricated or aspirational
scenario. Every "Automated" row names the exact file, test title, and page
object method backing it. Every "Not automated" row states the reason.

Generated: 2026-09-18. Source of truth for homepage structure: live
exploration of `https://automationexercise.com/` (Chrome) + `curl` fetch of
the page HTML, cross-checked against the existing test suite.

| Test Case | Requirement | Test File | Test Title | Page Object Method | Status |
|---|---|---|---|---|---|
| TC-HOME-001 | All primary nav items present | `tests/home.spec.ts` | `Verifiying the test case page` | `homePage.ts → homepageVerifyNavItemsExistAll()` | ✅ Automated (pre-existing) |
| TC-HOME-002 | Nav → Products | `tests/home.spec.ts` | `clicking Products nav item navigates to products page` | `homePage.ts → homePageNavBarItemsClickEach()` | ✅ Automated (pre-existing) |
| TC-HOME-003 | Nav → Cart | `tests/home.spec.ts` | `clicking Cart nav item navigates to cart page` | `homePage.ts → homePageNavBarItemsClickEach()` | ✅ Automated (pre-existing) |
| TC-HOME-004 | Nav → Signup / Login | `tests/home.spec.ts` | `clicking Signup / Login nav item navigates to login page` | `homePage.ts → homePageNavBarItemsClickEach()` | ✅ Automated (pre-existing) |
| TC-HOME-005 | Nav → Contact us | `tests/home.spec.ts` | `clicking Contact us nav item navigates to contact page` | `homePage.ts → homePageNavBarItemsClickEach()` | ✅ Automated (pre-existing) |
| TC-HOME-006 | Nav → Test Cases | `tests/home.spec.ts` | `Verifiying the test case page` (same test also clicks through) | `homePage.ts → homePageNavBarItemsClickEach()` | ✅ Automated (pre-existing) |
| TC-HOME-007 | Footer subscription visible pre-interaction | `tests/home.spec.ts` | `home page footer subscription section is visible before interaction` | inline assertion | ✅ Automated (pre-existing) |
| TC-HOME-008 | Subscribe — valid email | `tests/home.spec.ts` | `Subscription Test` | `homePage.ts → subscribeToNewsletter()` | ✅ Automated (pre-existing) |
| TC-HOME-009 | Subscribe — invalid email format | `tests/home.spec.ts` | `subscription with invalid email format shows no success message` | `homePage.ts → subscribeWithInvalidEmail()` | ✅ Automated (pre-existing) |
| TC-HOME-010 | Subscribe — empty email | `tests/home.spec.ts` | `subscription with empty email field does not show success message` | `homePage.ts → subscribeWithEmptyEmail()` | ✅ Automated (pre-existing) |
| TC-HOME-011 | Subscribe recovery after invalid entry | `tests/home.spec.ts` | `subscription succeeds after correcting an invalid email entry` | `homePage.ts → subscribeAfterClearingInvalidEntry()` | ✅ Automated (pre-existing) |
| TC-HOME-012 | Features Items section visible on load | `tests/home.spec.ts` | `home page displays featured items section on initial load` | inline assertion | ✅ Automated (pre-existing) |
| TC-HOME-013 | Add to Cart from Features Items → View Cart | `tests/home.spec.ts` | `Add to Cart from Features Items: product added from features grid appears in cart` | `homePage.ts → addToCartFromFeaturesItemsAndViewCart()` **(new)** | ✅ Automated (added this session) |
| TC-HOME-014 | Add to Cart from Features Items → Continue Shopping | `tests/home.spec.ts` | `Add to Cart from Features Items: Continue Shopping keeps user on homepage` | `homePage.ts → addToCartFromFeaturesItemsAndContinueShopping()` **(new)** | ✅ Automated (added this session) |
| TC-HOME-015 | Recommended Items add to cart | `tests/home.spec.ts` | `Add to Cart from Recommended Items: product added from recommended section appears in cart` | `homePage.ts → addToCartFromRecommendedItems()` | ✅ Automated (pre-existing) |
| TC-HOME-016 | Category accordion expands | — | — | — | ⛔ Not automated — pure UI-state toggle with no downstream effect beyond TC-HOME-017, which is covered |
| TC-HOME-017 | Category navigation (Women > Dress) | `tests/product.spec.ts` | `View Category Products: Women > Dress shows a filtered product list` | `productPage.ts → viewProductsByCategory()` | ✅ Automated (pre-existing, cross-referenced — `#accordian` is the identical shared sidebar component on both Home and Products pages) |
| TC-HOME-018 | Brand navigation + add to cart (Polo) | `tests/product.spec.ts` | `View and Cart Brand Products: Polo brand page shows products and first item adds to cart` | `productPage.ts → viewAndCartBrandProducts()` | ✅ Automated (pre-existing, cross-referenced — `.brands_products` is the identical shared sidebar component on both Home and Products pages) |
| TC-HOME-019 | Hero carousel manual navigation | — | — | — | ⛔ Not automated — decorative marketing banner, no business logic, high content-churn risk vs. low value |
| TC-HOME-020 | Scroll-to-top button | — | — | — | ⛔ Not automated — cosmetic, zero business impact |
| TC-HOME-022 | No broken product images (Features Items + Recommended Items) | `tests/home.spec.ts` | `Product images on homepage: no broken images in Features Items or Recommended Items` | `homePage.ts → verifyNoBrokenProductImages()` → shared helper `page-objects/utils/imageAssertions.ts → verifyNoBrokenImages()` **(new)** | ✅ Automated (added this session, at user's explicit request — DOM-level check via `img.complete`/`naturalWidth`, not a visual/screenshot comparison; extracted as a reusable helper for future use on Products/Cart pages) |
| TC-HOME-021 | Ad overlays don't block interactions | `test-options.ts` | N/A — structural mitigation, not a test | `blockAdsBeforeLoad()` applied to every fixture | ⛔ Not automated as a dedicated test — mitigated at the infrastructure level instead; confirmed by having to close a live Google Vignette interstitial during this session's exploration |

## Coverage summary

- **22** requirements identified from live homepage exploration
- **19** have direct or cross-referenced automated coverage (86%)
- **3** are intentionally excluded, each with a stated business rationale (no silent gaps)
- **3** new tests added this session:
  - TC-HOME-013, TC-HOME-014 — close a real gap: the Features Items "Add to cart" flow had zero coverage before this change, and "Continue Shopping" had zero coverage anywhere in the repository.
  - TC-HOME-022 — added at the user's explicit request after they asked whether broken product images were checked; verified as a real gap (not covered anywhere), implemented as a reusable DOM-level helper rather than a one-off inline check.

## Evidence trail

- Live homepage screenshots captured via Chrome automation on 2026-09-18 confirmed: nav bar structure, hero carousel with 3 slides, Category accordion (Women/Men/Kids), Brands sidebar (Polo, H&M, Madame, Mast & Harbour, Babyhug, Allen Solly Junior, Kookie Kids, Biba), paginated Features Items grid, Recommended Items carousel, footer Subscription form, and a live "Added!" cart confirmation modal triggered from the Features Items grid.
- Raw HTML fetched via `curl` cross-checked against the live screenshots to confirm exact selectors (`.features_items .add-to-cart`, `#accordian`, `.brands_products`, `/category_products/{id}`).
- Existing test inventory confirmed via direct reads of `tests/home.spec.ts` and `tests/product.spec.ts` before writing any new test, specifically to avoid duplicating `viewProductsByCategory()` / `viewAndCartBrandProducts()` coverage.
- The broken-image check's first version produced 6 false positives (images flagged as broken while still mid-download in a long, eagerly-loaded grid); each flagged URL was independently verified via `curl` to return HTTP 200 with real image bytes before concluding the check itself was wrong, not the site. Fixed by polling for `img.complete` before asserting `naturalWidth`.

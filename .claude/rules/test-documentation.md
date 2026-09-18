---
name: test-documentation
description: Defines how test case catalogs, the RTM, and the coverage report are created and kept in sync
paths: [docs/**, tests/**, page-objects/**]
---

# Test Documentation Rules

Established 2026-09-18 while adding homepage Add-to-Cart and broken-image
coverage. These rules govern `docs/` and how it relates to `tests/` and
`page-objects/`.

## 1. Before adding a new test, check the whole repo first

Before writing a test case or automating it, search the existing suite for
coverage that already exercises the same UI component — not just the same
page. Shared components (e.g. the category/brand sidebar `#accordian` /
`.brands_products`, present on both the homepage and the Products page)
must not be re-automated per page they appear on. One automated test per
distinct behavior, regardless of how many pages render the component.

Grep the repo for exact strings before claiming something is untested
(e.g. searching for `"Continue Shopping"` found only a docstring comment,
proving it was a real gap and not an oversight).

## 2. Only automate critical / business-relevant actions

Per project direction: automate checkout-path actions, primary navigation,
and lead-capture flows. Decorative or low-risk elements (marketing
carousels, scroll-to-top buttons) get documented in the test case catalog
for completeness, explicitly marked "not automated," with a one-line
business rationale — never silently dropped.

## 3. `docs/` structure

- `docs/test-cases/<page>-test-cases.md` — every identified requirement for
  a page/feature, typed (happy / negative / edge / navigation / recovery /
  UI state), prioritized, with evidence (what was actually observed) and
  an automation status.
- `docs/RTM.md` — Requirement Traceability Matrix. Every test case row
  names the exact test file, test title, and page object method backing
  it, or states the reason it's excluded. Never a fabricated or
  aspirational mapping — if a test doesn't exist yet, the row says so.
- `docs/reports/<page>-changes-report.html` — a living HTML coverage
  report (see rule 4).

All three are committed to git — they are living documentation, not
generated build output (unlike `playwright-report/`, `allure-report/`,
`test-results/`, which stay gitignored).

## 4. The HTML coverage report is living, not a snapshot

`docs/reports/*.html` must be **updated in the same change** whenever the
underlying automation changes (new test added, test removed, coverage
status changes) — never left describing a past session as if it were
still current. Treat it as the current state of coverage, not a diary
entry. If a report cannot be updated in a given change for some reason,
say so explicitly rather than letting it silently go stale.

## 5. Broken-image checks are DOM-level, not visual

Image-integrity checks (verifying a product image isn't broken/404) use
`img.complete` / `img.naturalWidth`, not a screenshot/visual comparison.
Implement as a shared helper in `page-objects/utils/` (see
`imageAssertions.ts → verifyNoBrokenImages()`) so any page object can reuse
it, rather than inlining the check per page. Poll for `img.complete`
before asserting `naturalWidth` — a long, eagerly-loaded image grid can
still be mid-download when the check runs, and asserting once immediately
produces false positives. Verify any "broken" result independently (e.g.
via `curl`) before trusting it — the check itself may be wrong.

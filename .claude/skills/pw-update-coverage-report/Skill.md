---
name: pw-update-coverage-report
description: Regenerates a page's test case catalog, RTM entry, and living HTML coverage report after tests/**, page-objects/**, or test-cases change — keeping docs/ in sync with the automation instead of letting it go stale. Use whenever tests are added, removed, or changed for a page covered by docs/test-cases/.
---

# Update Coverage Report

Keeps `docs/test-cases/<page>-test-cases.md`, `docs/RTM.md`, and
`docs/reports/<page>-changes-report.html` in sync with the actual test
suite, per `.claude/rules/test-documentation.md`. Run this any time
`tests/**` or `page-objects/**` changes for a page that already has a test
case catalog — never let the report describe a past state as if it were
current.

## Non-negotiable: zero fabrication

Every claim this skill writes must be independently verifiable, not
inferred or assumed. Before writing anything to `docs/test-cases/*.md`,
`docs/RTM.md`, or `docs/reports/*.html`:

- **Never invent a test case.** A test case may only be added if it
  corresponds to a real, observed behavior — either a real automated test
  that exists right now, or a behavior actually confirmed on the live page
  (exploration, a real click, a real screenshot). If you have not verified
  a behavior exists, do not write a test case describing it.
- **Never invent an RTM mapping.** A row that says "Automated" must name a
  test file, test title, and page object method that all actually exist —
  confirm with `grep`/`Read` before writing the row, every time, even if
  you believe you remember it correctly. If a mapping cannot be confirmed,
  the row says "not automated" or "unverified," never a guess dressed up
  as fact.
- **Never invent a test result.** Pass/fail counts, timings, and test
  titles in the HTML report must come from an actual `npx playwright test`
  run executed in this session (step 3) — never carried over from memory
  of a previous run, never estimated, never assumed to still be true.
- **Never invent evidence.** "Evidence" fields (screenshots, curl checks,
  live exploration notes) must describe something actually done in this
  session or a prior session's verifiable artifact (e.g. a file that still
  exists) — not a plausible-sounding description of what evidence *would*
  look like.
- **When uncertain, say so in the doc itself** — an explicit "not verified
  this run" beats a confident-sounding but unverified claim. A gap that's
  labeled is honest; a gap that's papered over is a fabrication.

## When to use this

- A test was added, removed, or its assertions materially changed
- A page object method backing a documented test case was added or renamed
- The user asks to "update the coverage report" / "keep the report in sync"
- Right after finishing new test coverage work, as the last step

## Procedure

### 1. Identify what changed

```bash
git status --short tests/ page-objects/
git diff --stat tests/ page-objects/
```

Read the diff, not just the file list — know exactly which test titles and
page object methods are new, removed, or modified before touching any doc.

### 2. Cross-check against the existing catalog — never fabricate a mapping

For the affected page, open `docs/test-cases/<page>-test-cases.md` and
`docs/RTM.md`. For every changed test:

- **New test, no existing TC-ID**: add a new test case entry (type,
  priority, evidence) using the next unused `TC-<PAGE>-0NN` number. Never
  renumber or reuse existing IDs — they're referenced elsewhere.
- **Removed test**: do not delete the TC-ID silently. Mark its RTM row as
  removed with the reason, or delete the test case only if the underlying
  requirement genuinely no longer applies (state why).
- **Modified test**: update the RTM row's test title/method reference so
  it still points at something that actually exists — grep for the method
  name in the page object to confirm it's real before writing the row.
- **Still not automated**: leave as-is; don't invent automation status.

### 3. Run the real suite — the report must reflect actual output

```bash
npx playwright test <spec-file> --project=chromium
```

Never write a "passed" line in the report from assumption. Capture the
actual pass/fail count and any test titles that changed status. If
something fails, fix it or report the failure honestly in the report —
do not paper over it.

### 4. Update the living HTML report

Edit `docs/reports/<page>-changes-report.html` in place (don't create a
new file):
- Stat grid numbers (total test cases, new tests, automated count,
  excluded count)
- File-changed list (section 01) — only list what's true for *this* update,
  not a cumulative history of every past session
- Test case catalog table — reflect current TC-IDs and statuses
- Verification run terminal block — real output from step 3
- Header `<b>Last updated:</b>` date

### 5. Republish to the same artifact URL

Check `docs/reports/ARTIFACT_LINKS.md` for this report's existing URL.

- If this conversation already published or read that URL this session,
  republish with `Artifact({ action: "publish", file_path: ..., url: <that URL> })`.
- If this is a fresh session that hasn't touched that artifact yet, first
  call `Artifact({ action: "read", url: <that URL> })` to attach it, then
  publish with the same `url`.
- If `ARTIFACT_LINKS.md` has no entry for this report yet, publish without
  `url` (creates a new artifact) and record the returned URL in
  `ARTIFACT_LINKS.md` immediately.

### 6. Leave changes uncommitted unless told otherwise

Per this project's working style, do not commit or push without the user
asking — show what changed and let them review first.

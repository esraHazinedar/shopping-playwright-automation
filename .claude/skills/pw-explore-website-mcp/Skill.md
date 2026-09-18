---
name: pw-explore-website-mcp
description: Explores a live website via Chrome MCP browser tools to gather grounding evidence for a new test case catalog — cost-disciplined (curl-first, batch actions, cheap model for the mechanical parts). Use when asked to explore a page/site live (no source access, or verifying live behavior source can't show) before writing docs/test-cases/*.md.
---

# Explore Website via MCP

Invoked on demand — not an always-on rule — when a page needs to be
explored live (via `mcp__claude-in-chrome__*` tools) to gather grounding
evidence before writing a test case catalog. Typical trigger: no access
to the page's source/markup ahead of time, or confirming a behavior that
static markup can't show (a modal, a hover state, real ad interference).

## Cost discipline

### 1. Reach for the cheapest tool that answers the question

Before opening a browser session:

- **Static structure questions** (what selectors/classes exist, what text
  is on the page, whether an element is present) — fetch the raw HTML with
  `curl` first. Near-zero cost, answers most "what's on this page"
  questions without a single screenshot.
- **Only use live browser interaction** for what `curl` genuinely cannot
  reveal: JS-driven modals, hover states, client-side validation messages,
  real ad/interstitial interference, anything requiring an actual
  click-and-observe cycle.

Reference example: exploring `automationexercise.com`'s homepage used
`curl` to establish DOM structure (selectors, category/brand markup,
product image markup) cheaply, and reserved the live browser only for
confirming the "Added!" cart modal and the category accordion's expand
behavior — things `curl` couldn't show.

### 2. Batch browser actions, don't single-step them

Use `browser_batch` (or sequence multiple actions in one exchange) instead
of one tool call per click/screenshot when the actions don't depend on
inspecting an intermediate result. Take a screenshot only when it's
actually needed to decide the next step or serve as documented evidence —
not reflexively after every action.

### 3. Don't re-verify what's already confirmed

Once a selector or behavior has been confirmed once (live or via `curl`),
don't re-check it again in the same run "just to be sure" unless the page
could plausibly have changed. Redundant verification burns tool calls and
tokens without adding information.

### 4. Delegate mechanical exploration to the cheapest capable model

If a long, mechanical exploration sequence (many pages, repetitive
clicking/scrolling, no synthesis needed) is being handed to a subagent,
default to **Haiku 4.5** — the cheapest/fastest available model.
Mechanical exploration (navigate, click, screenshot, report DOM
structure) needs accurate instruction-following and observation, not deep
reasoning. Step up to a more capable model only if the exploration itself
requires judgment calls.

Reserve full reasoning effort — on whichever model is running this
skill — for what actually requires it: deciding what's worth documenting,
resolving ambiguity, writing the test case catalog and RTM. That synthesis
step happens after this skill's exploration, not delegated away with it.

## Output of this skill

A set of confirmed, evidence-backed observations (selectors, behaviors,
screenshots) — not test cases themselves. Hand those observations to the
normal test-case-writing flow (`docs/test-cases/<page>-test-cases.md` +
`docs/RTM.md`, per `.claude/rules/test-documentation.md`), which still
applies the zero-fabrication standard: every documented test case must
trace back to something actually confirmed during this exploration.

---
name: environment-compatibility
description: Compatibility checks for dependency versions, Docker, and the local/CI environment before running tests
paths: [Dockerfile, docker-compose.yaml, package.json, package-lock.json, playwright.config.ts]
---

# Environment & Dependency Compatibility Rules

## 1. Dependency Version Compatibility (General)

Before bumping any dependency in `package.json`, or when picking up an update someone else made:

- **Check for a peer-dependency mismatch.** `allure-playwright` and `@playwright/test` are versioned independently — a major bump to either can break the reporter integration. Run `npm ls @playwright/test allure-playwright` and check `allure-playwright`'s own `peerDependencies` range before assuming compatibility.
- **Check `npm outdated`** before starting work that touches dependencies, so you know whether you're bumping past a major version boundary (which may carry breaking changes) versus a patch/minor (usually safe).
- **`@faker-js/faker` and `@types/node` are dev-time only** — a mismatch here won't break the live site interactions, but a major `faker` bump can change generated data shapes (e.g. `faker.internet.email()` output format), which can silently break assumptions in tests (see Rule 3 in `playwright-scripting.md` about dynamic values).
- **Always re-run the full suite (`npx playwright test`) after any `@playwright/test` version bump**, even a patch release — Playwright occasionally changes default timeout behavior or locator-matching semantics between versions, and this project's tests already sit close to `expect.timeout` boundaries on the live `automationexercise.com` site.

## 2. Playwright Version Must Match Across Three Places

Before running tests — locally, in Docker, or in CI — verify these three values agree:

| Source                          | Where                                              |
|----------------------------------|-----------------------------------------------------|
| `@playwright/test` version       | `package.json` → `devDependencies`                 |
| Base image Playwright version    | `Dockerfile` → `FROM mcr.microsoft.com/playwright:vX.Y.Z-noble` |
| Installed CLI version             | `npx playwright --version`                         |

If the Dockerfile's base image version is older or newer than `@playwright/test`, `npm install --force` inside the container can pull a test-runner version whose expected browser binaries don't match what the image shipped with — this causes browser-launch failures that are hard to diagnose from the error message alone.

**When bumping `@playwright/test` in `package.json`, always bump the `Dockerfile` base image tag to the matching `mcr.microsoft.com/playwright:vX.Y.Z-noble` version in the same change.** Confirm the tag actually exists in the registry before committing (e.g. `curl -s https://mcr.microsoft.com/v2/playwright/tags/list` and grep for the version) — not every patch version has a published Docker tag.

## 3. Docker Compose Command Syntax

This repo's `package.json` Docker scripts (`docker:build`, `docker:up`, `docker:test`, `docker:down`) call the standalone `docker-compose` binary (V1 syntax). Newer Docker Desktop / Engine installs only ship the V2 plugin form (`docker compose`, no hyphen). Before relying on these scripts on a new machine or a Jenkins agent, check which form is available:

```bash
docker compose version   # V2 (preferred on newer installs)
docker-compose version   # V1 (legacy standalone binary)
```

If only V2 is present, update the scripts in `package.json` to drop the hyphen rather than installing the legacy binary.

## 4. Local vs. Docker Baseline Parity

`automationexercise.com` is an external, shared, publicly-used site — not something this repo controls. Running the same test in Docker vs. locally does not guarantee identical timing behavior; Docker containers are frequently slower to start network requests due to CPU/network throttling on the host. Do not reduce assertion timeouts to make Docker runs "faster" — keep the same assertion-based waiting strategy (`expect(...).toBeVisible({ timeout })`) in both environments, per the existing scripting rules. Never add `page.waitForTimeout()` to compensate for Docker-specific slowness.

## 5. Before Running Anything — Checklist

1. Any recently bumped dependency has been checked for peer-compatibility and the full suite re-run (Rule 1).
2. `@playwright/test` version in `package.json` matches the `Dockerfile` base image tag (Rule 2).
3. `docker compose version` or `docker-compose version` resolves on the current machine (Rule 3).
4. `npx playwright test --list` succeeds locally with no import/config errors before attempting a Docker run — a Docker build failure is much slower to diagnose than a local config error.
5. Reports directories (`playwright-report/`, `test-results/`) are writable and correctly volume-mounted if running via `docker-compose` / `docker compose`, so results survive after the container exits.

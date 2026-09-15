## What this changes

<!-- One or two sentences. If it fixes an open issue, add "Fixes #123". -->

## Why

<!-- The problem this solves. For a bug fix, what the behavior was before. -->

## How to check it

<!--
The quickest way for a reviewer to see it working — a docs-site page and the interaction to try,
a Storybook story, or the test that fails without the change.
-->

---

See [CONTRIBUTING.md](CONTRIBUTING.md#what-a-pr-needs-before-merge) for the details behind each of
these.

- [ ] `pnpm lint:eslint`, `pnpm react:check:types`, and `pnpm test` pass locally
- [ ] Added or updated tests — including a `jest-axe` assertion for anything interactive
- [ ] **Changeset added** (`pnpm changeset`) if this changes `@chassis-ui/react`'s published
      behavior: an export, a prop, or observable DOM/class output. Not needed for docs-only,
      `packages/site`-only, or internal-tooling changes.
- [ ] **Ran `pnpm react:generate`** if any component's exported props changed, and committed the
      resulting `packages/site/content/api/` diff
- [ ] **Ran `pnpm react:build && pnpm react:check:api:update`** if the public API surface changed
      intentionally, and committed the `api-report.md` diff
- [ ] Read the relevant `AGENTS.md` (and [`FORMS.md`](../packages/react/FORMS.md) for any
      form-family component)

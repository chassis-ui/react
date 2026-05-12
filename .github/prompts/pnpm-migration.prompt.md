---
name: pnpm-migration
description: 'Phase 2 of chassis-react migration: migrate monorepo from Lerna + Yarn workspaces to pnpm workspaces. Run after Phase 1 (React 18 upgrade) is complete.'
---

# Phase 2 — Monorepo: Lerna/Yarn → pnpm Workspaces

**Prerequisite**: Phase 1 (React 18 upgrade) must be complete.  
**Check**: `.github/skills/react-migration/references/phase-status.md` Phase 1 = `[x]`  
**Completion marker**: Update Phase 2 status to `[x]` in phase-status.md

## Context

The repo currently uses Yarn workspaces + Lerna 4 for orchestration. The rest of the Chassis UI ecosystem (chassis-website, chassis-css, chassis-tokens, etc.) all use pnpm. Migrating ensures consistency and enables `packages/site` to link shared packages the same way.

After this phase, `packages/docs` is still present (deleted in Phase 3).

## Step 1 — Delete Yarn artifacts

```sh
cd /Volumes/Ozgur/Dropbox/Sites/chassis-react
rm yarn.lock
rm -rf node_modules
rm -rf packages/react/node_modules
rm -rf packages/docs/node_modules
```

## Step 2 — Remove Lerna

Remove from root `package.json`:
- `"lerna"` from `devDependencies`
- All `lerna run --scope` scripts

Remove `lerna.json` from repo root:
```sh
rm lerna.json
```

## Step 3 — Create `pnpm-workspace.yaml`

Create at repo root:
```yaml
packages:
  - 'packages/*'
```

## Step 4 — Update root `package.json`

Replace the `"workspaces"` field and all scripts:

```json
{
  "private": true,
  "scripts": {
    "postinstall": "node scripts/postinstall.js",
    "docs:dev": "pnpm --filter @chassis-ui/react-site dev",
    "docs:build": "pnpm --filter @chassis-ui/react-site build",
    "docs:preview": "pnpm --filter @chassis-ui/react-site preview",
    "lib:build": "pnpm --filter @chassis-ui/react build",
    "lint": "eslint \"packages/**/src/**/*.{js,ts,tsx}\"",
    "test": "node node_modules/.bin/jest --coverage",
    "test:update": "node node_modules/.bin/jest --coverage --updateSnapshot"
  }
}
```

Remove `"workspaces"` array — pnpm reads from `pnpm-workspace.yaml`.

Note: `"docs:api"` script is removed — API generation moves to a build step in Phase 6.

## Step 5 — Update dependency links

pnpm uses the same `link:` protocol as Yarn for local paths. Verify these in `packages/react/package.json` still work — no changes needed. Verify in `packages/docs/package.json` too (even though it's temporary).

Check `scripts/postinstall.js` still makes sense with pnpm — it may have been doing Yarn-specific setup.

## Step 6 — Install

```sh
pnpm install
```

Verify the workspace links are resolved: `packages/react` should have a `node_modules/@chassis-ui/tokens` symlink pointing to `../../../chassis-tokens`.

## Step 7 — Verify builds still work

```sh
pnpm --filter @chassis-ui/react build
pnpm test
```

## Step 8 — Mark complete

Update `phase-status.md` Phase 2 status to `[x]`.

## Verification Checklist

- [ ] `pnpm-workspace.yaml` exists at repo root
- [ ] `lerna.json` is deleted
- [ ] `yarn.lock` is deleted
- [ ] Root `package.json` has no Lerna references
- [ ] `pnpm install` succeeds
- [ ] `pnpm --filter @chassis-ui/react build` succeeds
- [ ] `pnpm test` passes

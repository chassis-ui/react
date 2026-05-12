---
mode: agent
description: 'Phase 1 of docs-integration: Add vendor/assets git submodule, create build/ scripts, align root package.json scripts to match other Chassis sites.'
---

# Docs Integration Phase 1 — Repo Infrastructure

Read the skill and references before starting:
- `.github/skills/docs-integration/SKILL.md`
- `.github/skills/docs-integration/references/codebase-facts.md`
- `.github/skills/docs-integration/references/phase-status.md`

**Reference sites** (examine these before writing any code):
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/build/sync-submodules.js`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/build/change-version.js`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/build/vnu-jar.js`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/package.json`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-website/build/sync-submodules.js`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-website/package.json`

## Goal

Establish the repo-level infrastructure that every other Chassis docs site has:
1. `vendor/assets` git submodule
2. `build/` folder with operational scripts
3. Root `package.json` aligned to site scripts pattern

## Steps

### 1. Add vendor/assets submodule

Run at repo root:
```bash
git submodule add -b app/docs https://github.com/chassis-ui/assets.git vendor/assets
git submodule update --init --recursive
```

Verify `vendor/assets/dist/web/docs/chassis/` exists with fonts, icons subdirectories.

### 2. Create build/sync-submodules.js

Adapt from `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/build/sync-submodules.js`.

Key differences from figma:
- The submodule is `vendor/assets` (same as figma, keeps `chassis-assets` name)
- No need for additional submodules beyond `vendor/assets`

### 3. Create build/change-version.js

Adapt from `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/build/change-version.js`.

Key difference:
- `FILES` array should target: `['README.md', 'packages/site/config.yml']`
- Version is in root `package.json`

### 4. Create build/vnu-jar.js

Copy directly from `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/build/vnu-jar.js` (no changes needed).

### 5. Update root package.json

Replace the current scripts with the standard Chassis site scripts (see `codebase-facts.md` for the full target state). Key changes:
- Remove `postinstall`, `docs:dev`, `docs:build`, `docs:preview`, `api:generate` (old names)
- Add `build`, `clean`, `dev`, `preview`, `site`, `site:build`, `site:clean`
- Add `astro:dev`, `astro:build`, `astro:preview`
- Keep `lib:build`, `lint`, `test`, `test:update`
- Add `change-version`, `sync-submodules`
- Add `picocolors` to devDependencies (used by build scripts)
- Keep all existing devDependencies for the React library tests

The `astro:dev` port should be `4327` (figma=4326, other ports in use by other sites).
The `--filter` name must match the `name` in `packages/site/package.json` (which will be updated to `chassis-react-site` in Phase 2).

### 6. Update vercel.json

Update the root `vercel.json` to match the standard pattern:
```json
{
  "buildCommand": "pnpm site:build",
  "outputDirectory": "_site",
  "installCommand": "pnpm install",
  "framework": null
}
```

## Verification

- `git submodule status` shows `vendor/assets` at expected commit
- `node build/sync-submodules.js` runs without error
- `node build/change-version.js --help` shows help text
- Root `package.json` has all required scripts
- `pnpm install` still works (run after any package.json change)

## Completion

Mark Phase 1 `[x]` in `.github/skills/docs-integration/references/phase-status.md`.

# design-sync notes — @chassis-ui/react → claude.ai/design

Repo-specific gotchas for future syncs. Read this and `config.json` before
touching anything; both are committed. See the **Re-sync risks** section at the
bottom for what can silently go stale.

## Shape and inputs

- Source shape is **storybook**. The Storybook config is at
  `packages/react/.storybook` (NOT repo root — this is a pnpm monorepo and the
  DS is `packages/react`).
- Reference storybook is built to `.design-sync/sb-reference` (gitignored). Build
  it from `packages/react`, with an absolute `-o`:
  `pnpm exec storybook build -c .storybook -o "<repo-root>/.design-sync/sb-reference" --quiet`
- Converter invocation:
  `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules packages/react/node_modules --entry packages/react/dist/index.js --out ./ds-bundle`
  `--node-modules` must be `packages/react/node_modules` — the repo-root
  `node_modules` has no `react`/`react-dom` (pnpm keeps them in the package).

## Fixes this sync had to make

- **[GENERAL] 0 components discovered on the first build.** `packages/react/package.json`
  declares no `types` / `typings` / `publishConfig.types`. That is *correct* for
  this package — tsdown emits `dist/index.d.ts` beside `dist/index.js` and TS
  resolves it adjacently (`pnpm react:check:package` → publint "All good!",
  `attw --profile esm-only` green on bundler + node16-ESM). But `lib/dts.mjs`'s
  `projectFor()` falls back to `<pkgDir>/index.d.ts`, which doesn't exist, so
  `getSourceFile(entry)` returned undefined → `exported PascalCase symbols: 0`
  → every storybook title reported `[TITLE_UNMAPPED]`.
  Fix: `.design-sync/overrides/dts.mjs` (declared in `cfg.libOverrides`) prefers
  `index.d.ts` inside the already-resolved `typesRoot` before the package-root
  guess. The fork is a ~15-line insert marked `---- FORK (chassis-react) ----`;
  everything else is upstream verbatim, so re-forking on a skill update is a
  copy + re-apply of that one hunk.
  *Alternative that would retire the fork:* add `"types": "./dist/index.d.ts"`
  to `packages/react/package.json`. Deliberately NOT done — it changes the
  published package manifest, and the sync must not alter the product.
- **[GENERAL] Framework CSS can't be referenced from `node_modules`.**
  `cfg.cssEntry` is bounded to the DS package directory by design (its content
  uploads verbatim; see the comment above `cfgPath` in `package-build.mjs`).
  `@chassis-ui/css` is a pnpm symlink out to the store, so
  `node_modules/@chassis-ui/css/dist/css/chassis.min.css` is rejected with
  `! cssEntry: … resolves outside the package — skipped`, leaving only the
  react package's own 4 KB `dist/style.css` in the bundle — i.e. everything
  unstyled. The storybook CSS-scrape fallback does not cover this either: it
  only fires when `_ds_bundle.css` is missing or an `@import`-only stub.
  Fix: `.design-sync/stage-assets.sh` copies `chassis.min.css` into
  `packages/react/.ds-css/` (gitignored, regenerated every sync) and `cfg.cssEntry`
  points there. It is the same file `.storybook/preview.tsx` imports, so
  previews and the reference style from identical bytes. The script is wired
  into `cfg.buildCmd`, so re-syncs re-stage automatically.

## Fonts

- `@chassis-ui/css` references `Inter` (`--cx-font-family-text`),
  `Archivo Narrow` (`--cx-font-family-display`) and `Fira Code`
  (`--cx-font-family-code`) but ships **no `@font-face` rules** — a consuming
  app is expected to provide them, and the reference storybook doesn't either.
  Both compare panels would therefore fall back to the same system font and
  *look* like a match while every claude.ai/design user got the wrong type.
- The woff2 files live in the `vendor/assets` submodule under
  `dist/web/docs/chassis/fonts/`, named by **role + weight** (`text-normal`,
  `display-strong`, `code-normal`, …) rather than by family, and nothing in the
  repo maps one to the other. `.design-sync/fonts.css` (committed) is that map;
  weights come from the compiled `--cx-font-weight-{text,display,code}-*` tokens
  in `chassis.css` (elegant/normal/strong/mass → 300/400/600/700 for text,
  400/500/600/700 for display, 400/700 for code).
- The vendored `vendor/assets/.../fonts/text.css` and `code.css` are NOT usable:
  their `url()`s point at `Inter-*.woff2` / `woff/FiraCode-*.woff` filenames
  that don't exist in that directory.

## Icons

- `Icon` renders **SVG-sprite mode by default**, with
  `sprite = '/static/icons/chassis-icons.svg'` — an absolute path to the docs
  site's static assets. That URL does not exist in the reference storybook and
  will not exist in claude.ai/design, so default-mode icons render empty on both
  sides (a compare "match" that hides a real defect).
- Font mode (`<Icon font name="…" />`) uses `cx-{name}` glyph classes. Those live
  in **`@chassis-ui/icons`** (a `packages/site` dependency) at
  `icons/chassis-icons.css` — the `cx-*` generation. Do NOT use
  `vendor/assets/.../icons/icons/chassis-icons.css`: that is an older build
  using `.icon-*` class names, which `Icon` never emits.
  It is wired through `cfg.extraFonts`, so the `@font-face` *and* the glyph
  classes ship inside `styles.css`'s import closure.

## Coverage

- 57 component directories in `packages/react/src/components`, but only **22**
  have stories (`packages/react/stories/**`). In the storybook shape, only
  storied components get real preview cards; the rest ship fully functional in
  the bundle with a floor card. Adding stories upstream is the way to widen
  preview coverage on a later sync.

## Theme root (`cfg.provider`)

- `.storybook/preview.tsx` wraps every story in `withThemeByDataAttribute({ attributeName:
  'data-cx-theme', defaultTheme: 'light' })`. The converter stubs all `@storybook/*`
  imports, and the stub does not materialise `withThemeByDataAttribute` as an own
  property, so esbuild's CJS interop resolved it to `undefined` and **all 22 previews
  threw** `withThemeByDataAttribute is not a function`.
- It is not cosmetic. `chassis.css` declares every token on `:root` with
  `color-scheme: light dark` and `light-dark()` values; `[data-cx-theme=light|dark]` only
  pins `color-scheme`. So with no attribute the UI follows the **viewer's** OS theme —
  previews and designs would silently render dark for a dark-mode user while the
  reference storybook rendered light.
- Fix: `.design-sync/preview-theme-root.js` exports a 3-line `ChassisThemeRoot`
  (`<div data-cx-theme={theme}>`), wired in as `cfg.extraEntries` + `cfg.provider`.
  Setting `cfg.provider` also skips decorator bundling entirely, which is what clears the
  error. It is a real bundle export, so the generated README/prompt.md wrap guidance is
  accurate rather than a generic note.

## Story skips

- `collapse-collapse--closed` and `toast-toast--placement-bottom-end` are `sb-error`
  ("no storybook root content") — a closed Collapse and a bottom-placed Toast render
  nothing in the storybook canvas either. Both are in `cfg.overrides.<Name>.skip`; their
  cells would have been blank.

## Card presentation

- `cfg.overrides`: `Col`, `GridItem`, `Popover` use `cardMode: "column"` (their stories are
  wider than a grid cell); `Toast` uses `cardMode: "single"` + `primaryStory: "Basic"`
  (fixed-position stories escape their cell). These are presentation-only keys — editing
  them takes a targeted `preview-rebuild.mjs` and does NOT re-grade.

## Known, triaged warnings — do not re-chase

- `[TOKENS_MISSING] 14` — `--cx-text-align`, `--cx-input-size`, `--cx-day-*` etc. are set
  at runtime by components (inline style / JS), not declared in a stylesheet. Non-blocking
  and expected; the render check is clean.
- `[DOCS_UNMAPPED] GridItem` — there is no `grid-item.mdx` in
  `packages/site/content/components`. Its `.prompt.md` is synthesized from the `.d.ts`.
  Add a doc upstream to fix it properly.
- `[REFERENCE_STALE?]` on the driver run — expected here: the *bundle* changed (config,
  provider, staged CSS) while the DS source did not, so `.design-sync/sb-reference` is
  still valid. Only rebuild the reference when `packages/react/src` or `stories/` change.

## Re-sync risks — what to watch next time

- **The `dts.mjs` fork is the fragile part.** It is a copy of the bundled `lib/dts.mjs`
  with one marked hunk. A design-sync skill update will change the rest of that file; the
  fork will keep running the OLD code until re-forked. On any re-sync where the skill
  version moved: re-copy `.ds-sync/lib/dts.mjs` over the fork and re-apply the
  `---- FORK (chassis-react) ----` hunk. If `packages/react/package.json` ever gains a
  `types` field, delete the fork and the `cfg.libOverrides` entry instead.
- **`.design-sync/fonts.css` is a hand-written map** from family+weight to the
  role-named woff2 files in `vendor/assets`. If the submodule renames, re-cuts, or
  re-weights those files, this map rots **silently** — the CSS still parses, the fonts
  just stop matching. Re-check it whenever `vendor/assets` is bumped.
- **The icon defect is upstream, not a sync artifact.** `Icon`'s default
  `sprite='/static/icons/chassis-icons.svg'` will keep producing empty icons in Claude
  Design until the library changes its default or callers use `font` mode. This is
  documented in `conventions.md`; if the library fixes it, update that section.
- **`stage-assets.sh` pins two dependency paths** —
  `packages/react/node_modules/@chassis-ui/css/dist/css/chassis.min.css` and
  `packages/site/node_modules/@chassis-ui/icons/icons/chassis-icons.min.css`. A major
  bump of either package that moves those files makes the script exit 1 with a clear
  message; fix the path there, not in config.
- **Partially verified:** `[STORY_CAP]` limited capture to the first 6 stories for
  `Notification` (9), `Carousel` (8) and `Flex` (7). The tail stories rendered cleanly in
  the validator's render check but were not individually image-graded. Pass
  `--max-stories 9` to compare if you want them covered.
- **Coverage is storybook-bound:** 22 of 57 components have stories. The other 35 ship
  fully functional in the bundle but have no preview card. Adding stories upstream is the
  only way to widen this.
- **Build assumptions:** Node 24 (`.nvmrc` v24.18.0), pnpm 10.33.2, storybook 10.6,
  playwright 1.62.1 + chromium. No network assets are fetched at build time — the Card
  stories' "800 × 400" images are the DS's own inline `Placeholder` SVG, so
  `[ASSETS_BLOCKED]` never applies here.

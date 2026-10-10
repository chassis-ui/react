# design-sync notes — @chassis-ui/react → claude.ai/design

Repo-specific gotchas for future syncs. Read this and `config.json` before
touching anything; both are committed. See the **Re-sync risks** section at the
bottom for what can silently go stale.

## Shape and inputs

- Source shape is **storybook**. The Storybook config is at
  `packages/react/.storybook` (NOT repo root — this is a pnpm monorepo and the
  DS is `packages/react`).
- Reference storybook is built to `.design-sync/sb-reference` (gitignored). Always
  build it with `bash .design-sync/build-reference.sh`: it runs `storybook build`
  from `packages/react` with an absolute `-o`, then injects the brand `@font-face`
  rules (see Fonts). `storybook build` empties its output directory, so a bare
  build loses the fonts; `SKIP_BUILD=1` redoes only the injection.
- Converter invocation:
  `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules packages/react/node_modules --entry packages/react/dist/index.js --out ./ds-bundle`
  `--node-modules` must be `packages/react/node_modules` — the repo-root
  `node_modules` has no `react`/`react-dom` (pnpm keeps them in the package).

## Fixes this sync had to make

- **[GENERAL] 0 components discovered on the first build.** `packages/react/package.json`
  declares no `types` / `typings` / `publishConfig.types`. That is _correct_ for
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
  copy + re-apply of the marked hunks.
- **[GENERAL] 0 components again on 2026-10-10: `packages/react/types/`.** That
  directory holds two ambient declarations for dev tooling (`jsdom.d.ts`,
  `postcss-prefix-custom-properties.d.ts`). `findTypesRoot()` tries `types` before
  `dist`, so it parsed those two files (`[DTS] parsed 2 .d.ts files from …/types`)
  and every title came back `[TITLE_UNMAPPED]`. Fix: a second
  `---- FORK (chassis-react) ----` hunk in `findTypesRoot()` takes the first
  candidate that has an `index.d.ts`. A healthy build logs
  `[DTS] parsed ~150 .d.ts files from …/packages/react/dist`.
  _Alternative that would retire the fork:_ add `"types": "./dist/index.d.ts"`
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
  _look_ like a match while every claude.ai/design user got the wrong type.
- The woff2 files live in the `vendor/assets` submodule under
  `dist/web/docs/chassis/fonts/`, named by **role + weight** (`text-normal`,
  `display-strong`, `code-normal`, …) rather than by family, and nothing in the
  repo maps one to the other. `.design-sync/fonts.css` (committed) is that map;
  weights come from the compiled `--cx-font-weight-{text,display,code}-*` tokens
  in `chassis.css` (elegant/normal/strong/mass → 300/400/600/700 for text,
  400/500/600/700 for display, 400/700 for code).
- The reference gets the same faces: `build-reference.sh` copies the woff2 files to
  `sb-reference/ds-fonts/` and links a copy of `fonts.css` from `iframe.html`, so both
  sides of a compare sheet render Inter. Without it the reference falls back to a
  system font and text metrics differ for a reason unrelated to the component.
- The vendored `vendor/assets/.../fonts/text.css` and `code.css` are NOT usable:
  their `url()`s point at `Inter-*.woff2` / `woff/FiraCode-*.woff` filenames
  that don't exist in that directory.

## Icons

- `Icon` renders **SVG-sprite mode by default** with `sprite = ''`, i.e.
  `<use href="#name">` against a sprite embedded in the page. Neither the reference
  storybook nor Claude Design embeds one, so a bare `<Icon name="…">` renders empty.
  That covers the icons components draw themselves: `IconSlot`
  (`packages/react/src/utils/iconSlot.tsx`) resolves a `DEFAULT_ICONS` key (`check`,
  `previous`, `next`, `menu`, `more`, `play`, `pause`, `increment`, `decrement`,
  `search`, `clear`, `expand`) to a name and renders `<Icon name>`, in `Carousel`,
  `Combobox`, `NavOverflow`, `Navbar`, `NumberField`, `Pagination`, `SearchField` and
  `Tree`; `AlertIcon`, `NotificationIcon` and `ToastIcon` render an `Icon` too.
  Accordion carets and the close button's cross are drawn by chassis-css, not by
  `Icon`, so those render with or without a sprite.
- Font mode (`<Icon font name="…" />`, or `<IconProvider font>` once at the root) uses
  `cx-{name}` glyph classes from **`@chassis-ui/icons`** (a `packages/site` dependency),
  `icons/chassis-icons.min.css`. `stage-assets.sh` concatenates that stylesheet into the
  staged CSS, so the `@font-face` and the glyph classes ship in `styles.css`'s closure.
- `cfg.provider` wraps every preview in `<IconProvider font>` (2026-10-10), the same
  root setup `conventions.md` tells the design agent to use. Consequence for grading:
  the three `Icon` stories are **blank in the reference and render glyphs in the
  preview**. That is the preview rendering more than the reference, not a mismatch:
  judge the glyph on its own. The same holds for every `IconSlot` icon listed above
  (NumberField's step buttons, Pagination's arrows, the Navbar toggler) and for the
  icon inside an `Alert`, `Notification` or `Toast`.

## Coverage

- 71 story files under `packages/react/stories/**` map to 71 components (2026-10-10,
  375 stories). The first sync (2026-09-07) covered 22; `Row` and `Col` were removed
  with the flexbox grid in react 0.4.0.
- 35 story files have a **`play` function**. The reference storybook runs it; a preview
  never does. Where `play` only asserts, both sides agree. Where it opens or types
  (`Modal` Live Demo clicks its trigger), the reference shows the state after the
  interaction and the preview shows what `render()` returns. Grade the preview's resting
  state on its own and say `play-driven` in the note; do not neutralise or rewrite the
  story to chase it. The form controls' `Default` story is play-driven in most of them
  (`Checkbox`, `Radio`, `Switch`, `RangeInput`, `NumberField`, `OtpInput`,
  `PasswordStrength`), so the primary story alone cannot license sibling-trusted
  grades there: judge a sibling without `play` from its images too.

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
- The chain is `ChassisThemeRoot theme="light"` → `IconProvider font` (see Icons). Both
  are bundle exports, so the generated README and every `.prompt.md` carry the same wrap.

## Harness patch (`compare.mjs`) — retired 2026-10-10

- `SearchField` and `Tree` stories carry a `withIcons` meta decorator with a hidden
  `<svg aria-hidden style="display:none">` sprite. It used to come FIRST in
  `#storybook-root`, and `captureStory()` in `.ds-sync/storybook/compare.mjs` waits for
  the first match of `SB_CONTENT` to be visible, so every story of the two reported
  `sb-error` "no storybook root content". The staged copy needed `:visible` appended to
  the `SB_CONTENT` selector after every restage.
- The two decorators now render `<Story />` before the sprite, so the unpatched harness
  finds the story. No patch is needed. If these stories report that `sb-error` again,
  look at the decorator order before patching anything.
- Those two story files embed their own sprite, so their icons render in the reference
  too (unlike the bare `Icon` stories).

## Story skips

- `collapse-collapse--closed`: a closed Collapse renders nothing in the storybook
  canvas either (`sb-error` "no storybook root content").
- `toast-toast--placement-bottom-end`: the story does render, but
  `Toaster placement="bottom-end"` portals to `document.body` and leaves
  `#storybook-root` empty, so the harness, which waits for root content, reports
  `sb-error`. Checked by hand on 2026-10-10: the same JSX from the bundle puts the toast
  at the same rect as the reference and looks identical.

## Card presentation

- `cfg.overrides` holds presentation-only keys taken from validate's `[GRID_OVERFLOW]`
  suggestions; editing them takes a targeted `preview-rebuild.mjs` and does NOT re-grade.
  - `cardMode: "single"` + `primaryStory` for overlays whose content is fixed or
    portalled: `Toast` (Basic), `Alert` (StackedWithCloseButton; `Confirm` starts
    closed and would leave a lone button), `ContextMenu` (Open), `Drawer` (Default),
    `Modal` (Default).
  - `cardMode: "single"` also where a grid card goes wrong without any `[PORTAL?]` or
    `[GRID_OVERFLOW]` line, so look at the card itself (the page without `?story=`):
    - `DatePicker` (Open), `DateRangePicker` (OpenWithPresets), `Menu` (Open): the
      overlay is an inline `position: absolute` child, not a body portal, and a cell's
      `overflow: hidden` clips it to a sliver.
    - `Tooltip` (Top): react-aria allows one open tooltip per page, so in a grid only
      the last-mounted story shows its tooltip.
    - `Popover` (Open): the stories' `margin: 400` decorator makes each cell ~970px
      tall, and a `left`/`right` popover whose trigger is below the fold is clamped up
      into the first viewport, away from its trigger.
  - `cardMode: "column"` for stories wider than a grid cell: `GridItem`, `Divider`,
    `Grid`, `NavOverflow`, `Navbar`, `Pagination`, `Placeholder`.
  - `cardMode: "column"` also for stories that reflow to fit a ~345px cell and stop
    telling each other apart, which `[GRID_OVERFLOW]` cannot see: `Stack` (its
    Responsive story follows a container query and renders vertical in a cell),
    `Container` (every max-width is wider than a cell, so all three stories fill it)
    and `Carousel` (800px slides squeezed to a cell). Any component with a
    container-query or max-width story is exposed the same way.

## Reading compare sheets

- The reference side is a crop of the `#storybook-root` ELEMENT; the preview side is the
  full 900x700 viewport. An overlay that leaves the root box (the inline calendar of
  `DatePicker` / `DateRangePicker` `Open*`, a body-portalled menu after a `play`) is
  cropped out of the reference although the storybook renders it. To grade those,
  screenshot `iframe.html?id=<story-id>&viewMode=story` at 900x700 yourself and compare
  it with the raw `__ds.png`.
- The two sides are scaled differently on the sheet, so 1px borders can look lighter on
  one of them. Judge borders from `compare/raw/`.
- **Accepted `close`:** `DatePicker` `Open`, `Open With Min Max`; `DateRangePicker`
  `Open`, `Open With Presets`; `Menu` `Open`, `Open With Header`, `Open Selected Item`.
  Content and styling are identical; the overlay sits 12px (8px for `Menu`, whose
  `containerPadding` is 8) to the right of its trigger's left edge in the preview and
  flush with it in the reference. Proven in the page: `transform: none` on the wrapper,
  or inline padding of that size, puts it flush, and the reference with
  `body { padding: 0 }` shows the same inset. The generated preview page mounts stories in `.ds-single` / `.ds-cell`, both
  `transform: translateZ(0)`, which makes that box the containing block of the inline
  overlay; react-aria's `useOverlayPosition` (default `containerPadding: 12`) then clamps
  the calendar 12px inside it. In storybook the container is the viewport and the body
  padding already clears 12px. The wrapper comes from `lib/emit.mjs`, which is
  app-contract surface and must not be forked, and an owned preview that pads the story
  would shadow the generated one for a framing artefact. Body-portalled overlays
  (`Combobox`, `Autocomplete`, `ContextMenu`, `Popover`, `Tooltip`) are not affected.
- **Accepted `close`:** `Link` `Icon Link`. The glyph touches the text in the preview: the
  text starts 22px from the link's left edge, 30px in the reference. chassis-css has
  `.icon-link > .icon { width: 1em; height: 1em }`. A sprite-mode svg matches
  `.icon:not(:empty)`, which sets `font-size: var(--cx-icon-size)` (1.5rem), so its box
  is 24x24. A font-mode span is `.icon:empty`: only its `::before` gets the 24px
  font-size, the span keeps the link's 16px, and the 24px glyph overflows the gap. It
  is what a design built with `<IconProvider font>` really renders, so no owned preview
  hides it. The fix is in chassis-css (size a font-mode icon's box like the svg's).
- `Spinner` `Grow`, and the grow half of `Sizes`, are blank on BOTH sides of a sheet:
  the harness resets infinite animations to their first frame, and `spinner-grow` starts
  at `scale(0)`. A blank pair proves nothing. Grade from your own capture of both pages
  (`iframe.html?id=…` and `<Name>.html?story=<Export>`) with `document.getAnimations()`
  paused at half their duration. Graded match that way on 2026-10-10.
- `Avatar` stories load `https://i.pravatar.cc/256?u=<n>`. Every URL is seeded since
  2026-10-10, so a story shows the same face on both sides and on every capture. An
  unseeded URL answers with a random face per request: if one comes back, the photo
  differs between the two sides for no reason in the component.
- `Notification` `Autohide` removes itself 5 seconds after load on both sides. It
  matches at capture; in a live card that cell empties, and a slow render check could
  see it blank.

## Known, triaged warnings — do not re-chase

- `tokens: … (1 missing, below threshold)` — custom properties components set at runtime
  (inline style / JS) are not declared in a stylesheet. Non-blocking and expected.
- `[DOCS_UNMAPPED]` `FloatingInput`, `GridItem`, `InputAdorn`, `Nav`, `RangeInput` — no
  page of that name in `packages/site/content/components` (they are documented on a
  sibling's page). Their `.prompt.md` is synthesized from the `.d.ts`.
- `docs: datagrid.mdx truncated` — the page is longer than the per-component cap.
- `[RENDER_THIN]` on `Alert`, `Drawer` and `Modal` — "rendered height is 0px". Their
  single-story card holds only `position: fixed` content, which gives the page no flow
  height. The cards render (see their compare sheets); do not author owned previews
  for it.
- `[PORTAL?]` on `FormField` — false positive. Its Wrapped Control story holds a closed
  `Combobox`, whose listbox is portalled to `body` as a hidden, zero-size
  `<div class="menu" hidden>`; the detector does not check visibility. Nothing paints
  outside the cells: do NOT set `cardMode: "single"`, which would drop two of the three
  stories from the card. `Combobox` and `Autocomplete` trip the same line for the same
  reason and need no `cardMode` either.
- `[REFERENCE_STALE?]` on the driver run — means the bundle changed while
  `sb-reference` did not. Harmless after a config-only change. After any change under
  `packages/react/src` or `stories/`, rebuild the reference with `build-reference.sh`
  before grading.

## Re-sync risks — what to watch next time

- **The `dts.mjs` fork is the fragile part.** It is a copy of the bundled `lib/dts.mjs`
  with two marked hunks (`findTypesRoot()` and `projectFor()`). A design-sync skill
  update will change the rest of that file; the fork keeps running the OLD code until
  re-forked. On every re-sync run `diff .ds-sync/lib/dts.mjs .design-sync/overrides/dts.mjs`:
  only the two `---- FORK (chassis-react) ----` hunks may differ. Otherwise re-copy and
  re-apply them. If `packages/react/package.json` ever gains a `types` field, delete the
  fork and the `cfg.libOverrides` entry instead.
- **The `compare.mjs` `:visible` patch lives only in the gitignored `.ds-sync/`.** A
  restage drops it. `SearchField` and `Tree` then report `sb-error` on every story the
  next time they are recaptured; see "Harness patch". Never answer that with a `skip`.
- **`sb-reference` must come from `build-reference.sh`.** A bare `storybook build`
  loses the injected fonts, and text-bearing sheets then differ in metrics.
- **`.design-sync/fonts.css` is a hand-written map** from family+weight to the
  role-named woff2 files in `vendor/assets`. If the submodule renames, re-cuts, or
  re-weights those files, this map rots **silently** — the CSS still parses, the fonts
  just stop matching. Re-check it whenever `vendor/assets` is bumped.
- **Previews render icons in font mode, the reference in sprite mode with no sprite.**
  If the library gives `Icon` a working default, or the stories embed a sprite, drop
  `IconProvider` from `cfg.provider` (a contract change: everything re-grades) and
  update the Icons sections here and in `conventions.md`. Until chassis-css sizes a
  font-mode icon's box, `Link` `Icon Link` stays `close`.
- **`stage-assets.sh` pins two dependency paths** —
  `packages/react/node_modules/@chassis-ui/css/dist/css/chassis.min.css` and
  `packages/site/node_modules/@chassis-ui/icons/icons/chassis-icons.min.css`. A major
  bump of either package that moves those files makes the script exit 1 with a clear
  message; fix the path there, not in config.
- **Partially verified.** `[STORY_CAP]` captures the first 6 stories. Raised to 11 and
  graded in full on 2026-10-10: `Grid`, `GridItem`, `NavOverflow`, `DataGrid`, `Tree`.
  Tail stories that rendered cleanly in validate but were not image-graded:
  `Autocomplete` Disabled; `Carousel` Overlay Controls, Ends Stop; `Chip` Component;
  `Divider` Matches Chassis Lines; `Flex` Responsive; `Nav` Fill; `Progress` With Label;
  `TimeField` States. Checked by hand against the reference, not recorded as grades:
  `Notification` Dismissible, Solid, With Actions; `Drawer` Live Demo (play-driven).
  The Navbar toggler is hidden at the 900px capture width on both sides, so its glyph
  is unverified.
- **Accepted `close`** (see "Reading compare sheets"): the open stories of `DatePicker`,
  `DateRangePicker` and `Menu` (card-wrapper inset), and `Link` `Icon Link` (font-mode
  icon box). Re-check them if `lib/emit.mjs` drops the wrapper transform or chassis-css
  changes `.icon-link`.
- **Play-driven stories** are graded on the preview's resting state. A story whose
  `render()` changes is caught by its source hash; a `play` that changes is not a
  preview change at all.
- **Network at view time:** the `Avatar` card loads photos from `i.pravatar.cc`.
  Everything else is self-contained (the "800 × 400" images are the library's inline
  `Placeholder` SVG). A capture from a shell without egress blanks those photos on both
  sides (`[ASSETS_BLOCKED]`): do not grade Avatar while that prints.
- **Build assumptions:** Node 24 (`.nvmrc` v24.18.0), pnpm 10.33.2, storybook 10.6,
  playwright + chromium installed under `.ds-sync/`.

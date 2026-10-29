# `chassis-react-claude-design`

A private package, never published. It builds the design system of `@chassis-ui/react` on claude.ai,
covering every brand of `BRANDS` (`src/paths.ts`) in light and dark, and publishes it to the
artifact named in `artifact.json`. RD numbers cite rows of [`DECISIONS.md`](../../DECISIONS.md);
RD27 says why this exists and why it is a package.

## Layout

- `src/` is the build. `build.ts` writes the system, `check.ts` renders it, and `publish.ts`
  sends it. `src/runtime/preview.ts` is bundled into the system as the preview runtime.
- `content/` holds the committed text the build fills in: the system's README, the cover and the
  publish prompt. `artifact.json` holds the artifact's url and its index marker.
- `dist/project/` is the artifact's `project/` folder, file for file. It is rebuilt on every run
  and never committed.
- It reads the other packages by path: the stories, `src/` and `dist/` of `packages/react`, the
  sidebar, docs pages and API files of `packages/site`, and `vendor/assets`. It resolves React
  and the chassis packages from `packages/react/node_modules`, so the bundle runs the React copy
  the library is built and tested with.
- `pnpm lint` at the root runs this package's `lint`: ESLint, Prettier and `check:types`.

## Running it

- `pnpm claude-design:sync` runs `claude-design:build`, then `claude-design:check`, then
  `claude-design:publish`. Run it after a release, from a clean checkout of the released commit:
  the index records the commit, with `+local changes` when the tree is dirty.
- The scripts are TypeScript that Node runs as it is, with `--experimental-strip-types`, so on any
  Node the root's `engines` allows. They import each other with `.ts` extensions and use no enums
  or parameter properties, which type stripping can't run.
- The build starts by deleting `dist/`. Never run the check, or a second build, while a
  build runs. The package's own `build` doesn't run `react:build` first; the root
  `claude-design:build` does, and the package's `build` alone reads whatever `packages/react/dist/`
  holds.
- `claude-design:check` stamps the tree it passed (`dist/checked.json`), and publishing refuses a
  tree it didn't pass. The headless session ends its reply with `RESULT: published <version>` or
  `RESULT: failed <reason>`, which is what `claude-design:publish` reads.
- Publishing starts a headless `claude -p` session, which needs the CLI signed in. Run `claude`
  and `/login` in a terminal, or set `CLAUDE_CODE_OAUTH_TOKEN`, which is what CI will need; that
  token is not tested yet.
  - The account must be able to edit the artifact.
  - A sync costs well under a dollar.
- The session may use only Artifact, Read, Grep and Glob. The Artifact tool reviews what it
  publishes, so `publish.ts` writes `dist/publish.json` beside the tree: the path map,
  each file's size and hash, and a scan for external references. The session reviews that
  instead of reading megabyte bundles. A fresh session must read the artifact before it can
  publish to it, so the prompt starts with a read.

## The stylesheet

- chassis-css has no brand switch. A brand is a whole compile with its own `_chassis-tokens.scss`
  first on the Sass load path, which is the swap point of `scss/config/_vendor.scss`.
- The diff pairs each brand's compile with the default brand's, rule by rule. It throws if they ever
  differ in rule count or selector. That would mean a brand changed the structure and not only the
  values, so the merge needs rethinking rather than a patch.
- A brand block keeps custom properties only. The `:root` token block also sets
  `color-scheme: light dark`. A copy of that on `[data-cx-brand]` beats `[data-cx-theme=dark]` on
  the same element, since both have equal specificity and the copy comes later, and dark mode
  silently stops working.
- The control check compares the default brand's compile with the published
  `dist/css/chassis.css`, on every custom property of the token block, so the default brand is
  the token set chassis-css compiles by default. If it fails, this build compiles chassis-css
  differently from chassis-css's own build: fix that first.

## Tokens and brands

- Values are read from the compiled token blocks, as `light-dark(<light>, <dark>)` pairs, not
  from `@chassis-ui/tokens`' Sass. A theme is a brand and a mode (`<brand>-dark`). The page's
  Colors and Shadows views show every theme as a column, and its theme menu picks the one the
  previews render. The page can't show one brand at a time in its own views: it draws them from
  tokens.json, side by side, or leaves them empty, and empty views were judged worse.
- Token names drop the `cx-` prefix. The page writes a custom property per token into the
  tokens.css every preview loads, and `--primary` reaches nothing in bundle.css.
- The hue's `deg` is stripped, because the page reads colour functions with plain numbers.
  Relative colours (`oklch(from …)`) and `var()` values are skipped.
- Radii differ by brand, but only colours and shadows can differ by theme, so each brand's radii
  are separate tokens (`<brand>-radius-md`), and each brand has its own set of type styles.
- A font family is named after its brand and face (`<brand>-<face>`, such as `chassis-inter`), so
  roles that share a face share one. The page takes 12 families.
- Spacing and shadows are one set for every brand, and the build stops if a brand changes one:
  the page can't vary a length by theme, and the README calls them shared.

## Adding a brand

When the brand is in `@chassis-ui/tokens` (`dist/web/docs/<brand>/`) and in the assets:

1. Add its id to `BRANDS` and its name to `BRAND_NAMES` in `src/paths.ts`.
2. Sync.

Everything else follows:

- the stylesheet, the themes and the README's brand lists and table;
- the cover;
- its fonts, which `assets.ts` copies. A brand's folder of each type is its built docs output
  where the pinned assets build made one, else `source/<brand>/docs/`, else the default brand's,
  the same fallback as the assets build.

Limits, which `claude-design:check` enforces:

- The page takes 8 themes and 12 font families, so at most four brands, and fewer when the
  brands have many faces. The check holds these and the page's other limits (colours, type groups
  and styles).
- A brand id is lowercase letters and digits. The preview runtime splits the menu's
  `<brand>-<mode>` on its hyphen.
- The brand's tokens must make the same rules as the default brand's. The stylesheet merge
  throws when they don't.

## The bundle

- It is built from `packages/react/src/`, not its `dist/`, because a classic script can't load the
  ESM chunks.
- `packages/react/package.json`'s `sideEffects` names the dist chunk of `suppressFocusRingGlobally`,
  not its source. A plugin marks the source as side-effectful. Without that, esbuild drops every
  barrel's import of it, and with it the focus-ring fix.
- React 19 ships no UMD build, so `components/lib/react{,-dom}.js` are bundled from the
  workspace's copy. `react-dom.js` merges `react-dom/client`, as React 18's UMD build did.
- `storybook/test` and every `@storybook/*` import resolve to a stub. `play` functions never run,
  so a card shows the resting state.

## Previews and cards

- `__preview.mount(name)` composes stories as Storybook does. It also maps the page's
  `<html data-theme="<brand>-<mode>">` to `data-cx-brand` and `data-cx-theme`, and embeds the
  icon sprite in `<head>` as `.storybook/preview.tsx` does (RD26).
- `cards.ts` picks a single story for overlays (they portal out of a cell, or position
  themselves) and full-width rows for wide stories. A new overlay component needs an entry there.
  The check passes without one, but its card would show every story at once.
- Cards are grouped by the docs sidebar. A component whose page is titled after something else
  needs an entry in `PAGE_TITLES` (`previews.ts`), and the build says which.
- The Avatar, Card and Placeholder stories load placeholder images from remote hosts. They render
  locally, but the artifact's preview frame only loads its own files, the script CDNs and Google
  Fonts, so on the page those images are probably blank. Nobody has checked yet.

## The cover

`content/cover.html` is hand-written to the type's cover brief. Its colours and radii are `--cx-*`
properties, so each theme renders it in its own brand. Rewrite it when the name, the palette or a
display face changes.

## What the system leaves out

Logos, favicons and other images are a project's, not the library's: the system carries the
components, the styles, the tokens and the fonts the tokens name, nothing else. A canvas that
switches brand (`data-cx-brand` on its root, which a Brand tweak can set) gets every brand's
colours, type, radii and fonts from the system, and brings its own images.

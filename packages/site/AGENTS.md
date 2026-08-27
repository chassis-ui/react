# `chassis-react-site`

The Astro docs site for `@chassis-ui/react`, published at chassis-ui.com/react. It consumes the
library via `@chassis-ui/react: workspace:*`, so local doc changes always reflect the current
in-repo state of the component library, not a published version — running docs against a real
release requires no extra step, but it also means a broken build in `packages/react` breaks the
site.

## Content model

- [`WRITING.md`](WRITING.md) — **read this before writing or
  editing any `.mdx` doc.** Covers voice, section order, the `<Example>`/`<PropTable>` shortcodes,
  and the `## Scope`/`## Accessibility`/`## API` conventions used across `content/**`.
- `content/<section>/<page>.mdx` — prose docs. Sections: `getting-started`, `components`,
  `patterns`. Every component doc — including the form-family and layout/grid pages — lives flat
  under `content/components/`; there's no separate `forms`/`layout` content directory. The
  sidebar's `Form Controls`/`Form Layout`/`Layout`/etc. groupings (`data/sidebar.yml`) are a nav
  presentation concern layered on top, not a filesystem split. Frontmatter needs `title` and
  `description`; `toc: true` enables the page's table of contents.
- `content/api/*.json` — **generated, not hand-written**. Produced by `pnpm react:generate`
  (`build/generate-api.ts`, run from the repo root) via `react-docgen-typescript` over
  `packages/react/src/components`. Re-run it after changing any component's exported props —
  otherwise `<PropTable component="Whatever" />` on the docs page silently shows stale props.
- `data/sidebar.yml` — the site nav structure. Adding an `.mdx` file under `content/` does **not**
  automatically add it to the sidebar; add a matching `title:` entry under the right section here
  too, or the page is only reachable by direct URL.
- `examples/<component>/*Example.tsx` — real React components used inside `<Example>` in
  `.mdx` files. These render live (via `client:load`) and their source is also auto-extracted and
  displayed as a code snippet below the preview by the `remarkCxExample` plugin
  (`src/libs/remark.ts`) — write these as if they're both a demo and documentation-quality
  sample, since the raw file content is what readers see.

## Where a new form component's docs page goes

Per `packages/react/FORMS.md`'s checklist: the doc page goes in `content/components/<kebab-name>.mdx`
(same directory as every other component), and the sidebar entry goes under one of the `Form
Controls`/`Form Layout` groups in `data/sidebar.yml`, matching where the existing form components
are already listed there.

## Astro-specific shortcodes/plugins (`astro.config.ts`, `src/libs/`)

- `<Example>` (`src/components/shortcodes/Example.astro`) — live preview + auto-derived source
  snippet, used pervasively instead of hand-pasting a `<Code>` block next to a demo.
- `<PropTable component="Whatever" />` (`src/components/shortcodes/PropTable.astro`) — renders
  the generated `content/api/Whatever.json` as a props table. Component name is matched
  case-insensitively against the generated JSON's filename — for a compound sub-part this is the
  same flat, root-prefixed name used everywhere else (`AccordionItem`), matching the actual
  exported identifier (`@chassis-ui/react` has no namespace/dotted API — see
  `packages/react/CONVENTIONS.md`).
- `remarkCxDocsref` / `remarkCxConfig` / `remarkCxExampleInlineChildren` (`src/libs/remark.ts`) —
  custom remark plugins layered into `getDocsMarkdownConfig()` from `@chassis-ui/docs`; read that
  file before adding a new MDX shortcode or custom directive, rather than reinventing one that
  might already exist there.
- `chassisAutoImportPlugin()` (`src/libs/shortcode.ts`) auto-imports shortcode components into
  every `.mdx` file, so `<Example>`/`<PropTable>` etc. don't need explicit `import` lines in each
  doc page — component imports from `@chassis-ui/react` for the examples themselves still do.

## Scripts

```bash
pnpm dev            # astro dev on :4327 (via root `pnpm dev`, alongside the lib's tsdown --watch)
pnpm build          # astro build alone — for the full pipeline, use root `pnpm site:build`,
                     # which also regenerates content/api and syncs the vendor/assets submodule first
pnpm preview
pnpm check          # astro check — type-checks .astro/.mdx (root: `pnpm site:check`)
pnpm lint           # eslint + stylelint + prettier, scoped to this package (root: `pnpm site:lint`)
pnpm format         # prettier --write, scoped to this package
```

Building this package directly (`pnpm --filter chassis-react-site build`) without first running
`pnpm react:generate` and `pnpm sync-submodules` from the root will build against whatever
`content/api/` and `vendor/assets` already happen to contain on disk — fine for iterating on
prose, not representative of a real `site:build`.

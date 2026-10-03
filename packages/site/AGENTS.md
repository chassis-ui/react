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
- `chassisDocs()` (from `@chassis-ui/docs/integration`, added in `astro.config.ts`) reads
  `config.yml` and `data/sidebar.yml`, sets `site` and `markdown`, resolves `[[config:key]]` and
  `[[docsref:/path]]` (a `[[docsref:]]` to a page that wasn't built fails the build), and
  auto-imports shortcodes into every `.mdx` file — the package's own plus everything in
  `src/components/shortcodes/`, where a same-named local file (e.g. `Example.astro`) replaces the
  package's. The package's `Icon` is excluded because it collides with `@chassis-ui/react`'s.
  Component imports from `@chassis-ui/react` for the examples themselves still need explicit
  `import` lines. Pages and components read the config with `getConfig()` / `getDocsPath()` from
  `@chassis-ui/docs/site`; `config.yml` is validated by a strict schema, so an unknown key fails
  the build. See the package's `UPGRADING.md` for the full contract.
- `remarkCxExample` / `remarkCxExampleInlineChildren` (`src/libs/remark.ts`) — this site's own
  remark plugins, passed to `chassisDocs({ markdown })` and run after the package's; read that
  file before adding a new MDX shortcode or custom directive.
- `src/libs/astro.ts` — this site's own integrations: copies the static files into `public/`,
  adds `mdx()` and `sitemap()`, and reloads the dev server on library or example changes.

## Pages (`src/pages/`)

- `index.astro` redirects to `/react`, the same as the sibling sites redirect to `/css` and
  `/tokens`; `react/index.astro` is the home page, assembled from the sections in
  `src/components/homepage/` (`HeroSection`, `IntroSection`, `FeaturesSection`, `HowSection`,
  `TechSection`, `DocsSection`), the same files the chassis-css and chassis-tokens sites have. Its
  `FeatureCard` icons come from the `cx-sprite.svg` the page inlines, not the `chassis-icons.svg`
  sprite the `Icon` examples use. `react/docs/index.astro` redirects to the Introduction page.
- `config.yml`'s `title` is short (`Chassis - React`, like `Chassis - CSS`) because the shared
  `Head` appends it to every page's own title and html-validate caps a `<title>` at 70
  characters; the descriptive title lives on the home page's `<BaseLayout title>`.

## Static paths

The shared CSS, fonts, icons and images stay on `/static/`, which chassis-ui.com routes by the
`Referer` header so that the browser keeps one copy across the Chassis sites. The files Astro
builds do not: a script that another script imports has that script as its `Referer`, which names
no site. `astro.config.ts` writes them to `static/astro/` with `build.assetsPrefix: '/react'`, so
pages request `/react/static/astro/…`, and the root `vercel.json` rewrites that path to
`/static/astro/`. Keep the three in step (task A6 of chassis-website's `ref/SIBLING_TASKS.md`).

## Scripts

```bash
pnpm dev            # astro dev on :4327 (via root `pnpm dev`, alongside the lib's tsdown --watch)
pnpm build          # astro build alone — for the full pipeline, run root `pnpm site:setup`
                     # (vendor/assets, the library, content/api) and then root `pnpm site:build`
pnpm preview
pnpm check          # astro check — type-checks .astro/.mdx (root: `pnpm site:check`)
pnpm lint           # eslint + stylelint + prettier, scoped to this package (root: `pnpm site:lint`)
pnpm format         # prettier --write, scoped to this package
pnpm lint:html      # html-validate over ../../_site, with html-validate.json (root: `pnpm lint:html`)
pnpm lint:vnu       # the Nu Html Checker over ../../_site, with vnu-filters.txt (root: `pnpm lint:vnu`)
```

Building this package directly (`pnpm --filter chassis-react-site build`) without first running
`pnpm react:generate` and `pnpm vendor` from the root will build against whatever
`content/api/` and `vendor/assets` already happen to contain on disk — fine for iterating on
prose, not representative of a real `site:setup` + `site:build`.

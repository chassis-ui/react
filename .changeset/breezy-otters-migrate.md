---
"@chassis-ui/react": major
---

**Breaking:** the package now ships ESM-only, built by tsdown instead of Rollup.

- Removed CJS output and the `main`/`module`/`jsnext:main` package.json fields — `require('@chassis-ui/react')` no longer resolves. Consumers must import it as ESM (`import { Button } from '@chassis-ui/react'`); resolution goes entirely through the `exports` map now.
- CSS for the calendar/datepicker family and `Table`'s sort/selection UI is no longer injected into the page via a JS-created `<style>` tag at import time. It's now a real, separate `dist/style.css` file that a consuming app must import explicitly:

  ```js
  import '@chassis-ui/react/style.css'
  ```

  Skipping this import doesn't error — those specific pieces (`Calendar`, `RangeCalendar`, `DatePicker`, `DateRangePicker`, and `Table`'s sort/selection column) will simply render unstyled. Every other component is styled entirely through `@chassis-ui/css` and is unaffected.
- The package now ships a single `'use client'`-banner ESM bundle (`dist/index.js`) plus a bundled `dist/index.d.ts` — no more separate `dist/index.es.js`.

See `AGENTS.md`'s "Build" section and `THEMING.md`'s "Component-scoped CSS" for the full detail.

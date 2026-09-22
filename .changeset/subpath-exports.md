---
'@chassis-ui/react': minor
---

Every component family is now published as its own entry point, so a page only ships the
components it actually imports (#22). The subpaths are named after the component folders:

```tsx
import { Button } from '@chassis-ui/react/button'
import { TextInput } from '@chassis-ui/react/text-input'
import { Modal, ModalBody, useModal } from '@chassis-ui/react/modal'
```

Until now the package was a single `dist/index.js` behind one `'use client'` directive. Turbopack
(Next.js 16's default bundler) can't tree-shake unused exports out of a `'use client'` module, so a
page rendering one `Button` shipped every component, and the react-aria/react-stately hooks behind
them, to the browser: about 214 KB gzip of client JS on top of Next.js's own baseline, whichever
bundler was used. Importing the same `Button` from `@chassis-ui/react/button` ships about 13 KB
under Turbopack and 11 KB under webpack. Each subpath carries its own `'use client'` directive, so it
works directly from a Server Component, just like the root entry.

The root `@chassis-ui/react` entry is unchanged and still exports everything. Both import styles
resolve to the same shared chunks, so mixing them is safe: `Modal` from `/modal` and `useModal` from
the root read the same context. Each family's hook is also exported from its subpath (`useModal`,
`useDrawer`, `useToast`, `useNotification`, `usePagination`).

`sideEffects` in `package.json` is now accurate. Only the entry files, the chunk that installs the
global focus-ring listener, and `style.css` are marked as having side effects, so webpack and Vite
also drop unused components from a root import (about 16 KB for the same page under webpack). This
also fixes a latent build bug: the listener's side-effect import was being tree-shaken out of the
bundle, and it only survived because `RangeCalendar` happened to import the same module.

The `DataGrid*Props` types are now exported from the root entry too. Before, they were only
reachable from the component's own module.

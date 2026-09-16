---
'@chassis-ui/react': patch
---

Fix a guaranteed SSR hydration-mismatch warning on `Table`'s auto-injected select-all column
(`selectionMode="multiple"`). react-stately's `@react-stately/table` derives that column's key
from a module-scoped `'row-header-column-' + Math.random()` constant computed once per JS
environment, so the `id`/`data-key` attributes react-aria puts on `TableSelectAllCell`/
`TableSelectionCell` never match between the server render and the browser's hydration pass. The
mismatch is confined to that internal bookkeeping attribute (no visible content, nothing else
references it), so both cells now render with `suppressHydrationWarning` — the underlying
react-stately behavior is unchanged and not something this package can fix.

// Setup file for the `storybook` project only (see vitest.config.ts) — the one that runs stories in
// actual Chromium rather than jsdom.
//
// Real browsers have no `process` global. react-stately's Virtualizer unconditionally reads
// `process.env.NODE_ENV`/`process.env.VIRT_ON`, throwing a bare `ReferenceError` here instead. Only
// surfaces once something in this package actually renders react-aria-components' `Virtualizer`
// (DataGrid, currently the only consumer) — polyfill just enough for those reads to resolve instead
// of patching every dependency that might assume it.
if (typeof globalThis.process === 'undefined') {
  // @ts-expect-error minimal stand-in, not a real `process` — only `.env` is ever read here
  globalThis.process = { env: {} }
}

// Vite inlines `process.env.NODE_ENV` as `"test"` into this bundle, and the Virtualizer treats that
// as "skip windowing entirely": `getVisibleLayoutInfos` widens its visible rect to the full content
// size unless `VIRT_ON` is also set. Left alone, `DataGrid`'s 500-row stories mounted all 500 rows
// (1500 cells) instead of the ~15 that fit, which crashed the browser page outright above ~350 rows
// — taking every test in that story file down with it — and quietly meant these tests never
// exercised the virtualized path they exist for.
//
// Set here rather than as a Vite `define` in this project's config: `define` is merged into the
// shared Vite config across projects, so it also reached the jsdom project, where windowing against
// a layout engine that reports every element as 0×0 renders no rows at all. `VIRT_ON` isn't one of
// the keys Vite inlines, so this plain runtime assignment is what the Virtualizer actually reads.
process.env.VIRT_ON = '1'

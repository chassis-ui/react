// Development-only misuse warnings, in one place so every component reports misuse the same way
// and none of it reaches a consumer's production bundle.
//
// Two problems this fixes over calling `console.warn` directly, which is what every call site used
// to do:
//
// 1. **They fired in production.** Nothing in this package guarded on `NODE_ENV`, so every
//    `console.warn` ran for end users of a consuming app. `process.env.NODE_ENV` is the idiom
//    bundlers (Vite, webpack, Turbopack, Rollup) replace with a literal, so in a production build
//    `IS_DEV` folds to `false` and no warning is ever emitted. Relying on that substitution adds
//    no new constraint: `react-dom` — a peer dependency, so always present — already requires
//    exactly the same replacement.
// 2. **They repeated.** Most call sites warn during render, so a warning re-fired on every
//    re-render, and twice per render under StrictMode's double-invoke. De-duplicating on the
//    message means a misuse is reported once and stays readable in the console.
//
// What this does *not* do is strip the message strings from the bundle. Measured with esbuild
// against the built `dist/index.js`: a `NODE_ENV=production` consumer bundle still contains them.
// `tsdown` minifies this package's own output first (`minify: true`), collapsing each function to
// a `IS_DEV && cond && ...` expression, and a consumer's minifier won't then inline that call to
// discover its arguments are droppable. Building unminified would let them drop, at the cost of
// shipping pretty-printed dist — not worth it for a few hundred gzipped bytes. The behavior that
// mattered (nothing logged in production, nothing repeated in development) is the part that's
// fixed; treat the strings as part of the bundle's fixed cost.
const IS_DEV = process.env.NODE_ENV !== 'production'

const warned = new Set<string>()

/**
 * Resets the de-duplication set. Test-only — the suite asserts on these warnings, and without a
 * reset between tests the *second* test in a file to trigger the same message would see nothing.
 * Called from a global `beforeEach` in `test/setup.ts`.
 */
export function resetDevWarnings(): void {
  warned.clear()
}

/**
 * Logs `message` once via `console.warn` when `condition` is true, in development builds only.
 * Use for a recoverable misuse: the component still renders something sensible.
 */
export function devWarning(condition: boolean, message: string): void {
  if (!IS_DEV) return
  if (!condition || warned.has(message)) return
  warned.add(message)
  console.warn(message)
}

/**
 * Logs `message` once via `console.error` when `condition` is true, in development builds only.
 * Use for a misuse that leaves the component genuinely broken (e.g. a required prop missing).
 */
export function devError(condition: boolean, message: string): void {
  if (!IS_DEV) return
  if (!condition || warned.has(message)) return
  warned.add(message)
  console.error(message)
}

import { builtinEnvironments } from 'vitest/environments'

// Turns a Node test file into a browser, after it has rendered its server HTML: installs the same
// jsdom window the rest of the suite gets from `environment: 'jsdom'`, then resets the module
// graph so this package's own modules imported afterwards are evaluated afresh with `window`
// defined, as a browser bundle's would be. Import them dynamically after this resolves; a static
// import still holds the server's copy.
//
// Dependencies in node_modules (React, react-aria, testing-library) are externalized by Vitest and
// not re-evaluated, so both halves share one React. Anything a dependency bound to `document` at
// import time stays unbound: use `within(document.body)`, not testing-library's `screen`.
export async function installClientEnvironment(): Promise<void> {
  await builtinEnvironments.jsdom.setup(globalThis, { jsdom: { url: 'http://localhost/' } })
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

  vi.resetModules()
  // The project's setup file already ran this before a DOM existed, when it had nothing to patch.
  await import('../dialogPolyfill')
}

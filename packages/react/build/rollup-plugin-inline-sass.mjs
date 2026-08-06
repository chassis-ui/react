import { fileURLToPath } from 'url'
import path from 'path'
import { readFileSync } from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// Runs once per bundle (deduped by Rollup like any other imported module) and appended as a
// `<style>` tag on import — matches the shape of the `style-inject` package rollup-plugin-postcss
// used to pull in for the same purpose, trimmed to only the call shape this build actually uses
// (no `insertAt`/`ref` option).
const STYLE_INJECT_ID = '\0rollup-plugin-inline-sass:style-inject'
const STYLE_INJECT_SOURCE = `export default function styleInject(css) {
  if (!css || typeof document === 'undefined') return
  var style = document.createElement('style')
  style.type = 'text/css'
  document.head.appendChild(style)
  style.appendChild(document.createTextNode(css))
}
`

// Compiles `.scss`/`.sass` imports with Sass's modern, non-deprecated `compile()` API (unlike
// every current Rollup Sass plugin — rollup-plugin-postcss, rollup-plugin-scss,
// rollup-plugin-styles — which still call the legacy `render`/`renderSync` entry point Dart Sass
// prints a `[legacy-js-api]` warning for and removes outright in 2.0), and passes plain `.css`
// imports through unchanged. Both emit the result as a side-effecting JS module that injects it
// as a `<style>` tag, for components with no chassis-css visual equivalent (see `AGENTS.md`'s
// Layout section).
export default function inlineSass({ includePaths = [] } = {}) {
  const sass = require('sass')

  return {
    name: 'inline-sass',
    resolveId(id) {
      if (id === STYLE_INJECT_ID) return STYLE_INJECT_ID
    },
    load(id) {
      if (id === STYLE_INJECT_ID) return STYLE_INJECT_SOURCE
    },
    transform(code, id) {
      if (!/\.(scss|sass|css)$/.test(id)) return null

      this.addWatchFile(id)
      let css

      if (id.endsWith('.css')) {
        css = readFileSync(id, 'utf8')
      } else {
        const result = sass.compile(id, {
          loadPaths: [path.dirname(id), ...includePaths]
        })
        css = result.css
        for (const url of result.loadedUrls) {
          if (url.protocol === 'file:') this.addWatchFile(fileURLToPath(url))
        }
      }

      return {
        code:
          `import styleInject from ${JSON.stringify(STYLE_INJECT_ID)}\n` +
          `styleInject(${JSON.stringify(css)})\n`,
        // The generated JS has no line-for-line correspondence to the compiled source (it's a
        // compile/read step, not a textual transform) — same no-op mapping rollup-plugin-postcss's
        // own `inject: true` mode produced for these files (verified against the current `dist/`
        // output: no `.scss`/`.css` entries appear in its sourcemap `sources` at all).
        map: { mappings: '' }
      }
    }
  }
}

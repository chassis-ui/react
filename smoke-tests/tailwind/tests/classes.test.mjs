import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { page } from '../src/page.mjs'

// Every class the page carries, and the regular build of @chassis-ui/css styles, has to have a
// rule in the stylesheet Tailwind built. In the Tailwind entry a utility is generated only where
// Tailwind finds its name, so a class it cannot find renders with no rule, and neither build
// warns. See README.md.
//
// Run `pnpm smoke:test` from the repo root: it builds the library and dist/app.css first.

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

// The class names in the selectors of a stylesheet, unescaped: `.\32 xl\:w-6\/12` is
// `2xl:w-6/12`, and `.\@md\:col-span-3` is `@md:col-span-3`.
const classNames = (css) =>
  new Set(
    Array.from(css.matchAll(/\.((?:\\[0-9a-f]{1,6} ?|\\.|[\w-])+)/gi), (match) =>
      match[1]
        .replace(/\\([0-9a-f]{1,6}) ?/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/\\/g, '')
    )
  )

const styled = classNames(read('../dist/app.css'))
// What the same markup gets from the regular build, which ships every class. A class it has no
// rule for (`pagination-item`) is a hook, not a gap of the Tailwind build.
const regular = classNames(read('../node_modules/@chassis-ui/css/dist/css/chassis.css'))

const html = renderToStaticMarkup(page)
const rendered = new Set(
  Array.from(html.matchAll(/class="([^"]*)"/g), (match) => match[1].split(/\s+/))
    .flat()
    .filter(Boolean)
)

describe('a Tailwind build of @chassis-ui/css', () => {
  test('the page renders the classes this test is about', () => {
    // Built at runtime by a layout prop: in the safelist of @chassis-ui/css.
    for (const name of ['md:col-span-5', '@lg:grid-cols-4', '2xl:gap-2xl', 'md:w-7/12']) {
      assert.ok(rendered.has(name), `the page has no ${name}`)
    }
    // Whole names in the built package: found through the `@source` rule.
    for (const name of ['bg-success', 'spinner-danger', 'icon-warning', 'link-primary']) {
      assert.ok(rendered.has(name), `the page has no ${name}`)
    }
    for (const name of ['float-end', 'justify-content-center', 'align-middle', 'd-flex']) {
      assert.ok(rendered.has(name), `the page has no ${name}`)
    }
  })

  test('has a rule for every class of the page that the regular build has one for', () => {
    const expected = [...rendered].filter((name) => regular.has(name))
    assert.ok(expected.length > 60, `only ${expected.length} classes of the page are styled`)
    assert.deepEqual(
      expected.filter((name) => !styled.has(name)),
      []
    )
  })

  test('still generates on demand: a class nothing names has no rule', () => {
    // Neither the page, the package nor the safelist names a padding at a breakpoint.
    assert.ok(!styled.has('xl:p-6xl'))
    assert.ok(styled.has('md:col-span-11'), 'the safelist is loaded')
  })
})

import * as React from 'react'
import fs from 'node:fs'
import path from 'node:path'
import { render, screen } from '@testing-library/react'

import * as library from '../../src/index'
import { STILL_FAILS } from '../ssr/stories'

// `asChild` with an `<a>` child must render what `component="a"` renders: the same classes and the
// same semantics (role, disabled handling, aria state). This runs every polymorphic component
// through both, with and without `disabled`, and compares the attributes that carry them. The
// child is a plain `<a>`, and then a router link: a component element that renders an `<a>`, which
// is what a consumer hands to `asChild` in practice.
//
// The list is every `createPolymorphicComponent` call under `src/components`, read from source, so
// a new polymorphic component is covered without editing this file.
const SOURCES = fs
  .readdirSync(path.resolve(__dirname, '../../src/components'), {
    recursive: true,
    encoding: 'utf8'
  })
  .filter((file) => file.endsWith('.tsx'))
  .map((file) => ({
    file,
    source: fs.readFileSync(path.resolve(__dirname, '../../src/components', file), 'utf8')
  }))

const POLYMORPHIC = SOURCES.flatMap(({ source }) =>
  [...source.matchAll(/export const (\w+) = createPolymorphicComponent/g)].map(
    (match) => match[1] as string
  )
).sort()

// Under `asChild` a render function's `component` is a `Slot`, so a comparison with a tag name,
// or a `typeof` check, takes the wrong branch for a slotted `<a>`. `resolveElementKind` and
// `resolveElementTag` (`src/utils/elementKind.ts`) answer for a tag and for a `Slot` alike.
const TAG_COMPARISON =
  /\b(component_?|tag)\b(\.props\.component)? [!=]== '|typeof component_? [!=]== /i

const ATTRIBUTES = [
  'class',
  'href',
  'role',
  'disabled',
  'aria-disabled',
  'tabindex',
  'aria-current',
  'aria-pressed'
]

// Cases known to fail, each with its reason. Empty since phase B2 of AUDIT-PLAN.md; a case listed
// here is expected to fail, so an entry has to be deleted with its fix.
const KNOWN_FAILURES: Record<string, string> = {}

// Components that throw outside their parent are rendered inside it.
const PARENTS: Record<string, React.ElementType> = {
  CarouselInner: library.Carousel
}

// Props the `component="a"` side needs to reach the branch `asChild` takes. `Placeholder` renders
// `component` only when it has a `src`; under `asChild` the child is the image and holds it.
const COMPONENT_PROPS: Record<string, Record<string, unknown>> = {
  Placeholder: { src: '/image.png' }
}

// Stands in for a router link (e.g. `next/link`): it renders an `<a>` and forwards its props.
const RouterLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>((props, ref) => <a ref={ref} {...props} />)
RouterLink.displayName = 'RouterLink'

const CHILDREN: Record<string, React.ElementType> = { '<a>': 'a', 'router link': RouterLink }

type Attributes = Record<string, string | null> | null

function attributesOf(element: React.ReactElement): Attributes {
  // A few components warn in development about a prop combination (`href` on a non-link, ...);
  // the warning is not what's compared.
  const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  try {
    const { unmount } = render(element)
    const subject = screen.queryByTestId('subject')
    const attributes = subject
      ? Object.fromEntries(
          ATTRIBUTES.map((name) => [
            name,
            name === 'class' ? [...subject.classList].sort().join(' ') : subject.getAttribute(name)
          ])
        )
      : null
    unmount()
    return attributes
  } finally {
    consoleWarn.mockRestore()
  }
}

const cases = POLYMORPHIC.flatMap((name) =>
  Object.keys(CHILDREN).flatMap((child) => [
    { name, child, disabled: false, key: `${name}, ${child}` },
    { name, child, disabled: true, key: `${name} disabled, ${child}` }
  ])
)

describe('asChild with an <a> child renders what component="a" renders', () => {
  test('finds every polymorphic component', () => {
    expect(POLYMORPHIC).toHaveLength(70)
    for (const name of POLYMORPHIC) expect(library).toHaveProperty(name)
  })

  test('no component compares its `component` to a tag name', () => {
    const offenders = SOURCES.flatMap(({ file, source }) =>
      source
        .split('\n')
        .filter((line) => TAG_COMPARISON.test(line))
        .map((line) => `${file}: ${line.trim()}`)
    )
    expect(offenders).toEqual([])
  })

  test('lists only cases that exist', () => {
    const keys = new Set(cases.map(({ key }) => key))
    expect(Object.keys(KNOWN_FAILURES).filter((key) => !keys.has(key))).toEqual([])
  })

  test.for(cases)('$key', ({ name, child, disabled, key }) => {
    const Component = (library as unknown as Record<string, React.ElementType>)[name]!
    const Parent = PARENTS[name] ?? React.Fragment
    const Child = CHILDREN[child]!
    const extra = disabled ? { disabled: true } : {}

    const expected = attributesOf(
      <Parent>
        <Component
          component="a"
          href="/target"
          data-testid="subject"
          {...COMPONENT_PROPS[name]}
          {...extra}
        >
          Content
        </Component>
      </Parent>
    )
    const actual = attributesOf(
      <Parent>
        <Component asChild {...extra}>
          <Child href="/target" data-testid="subject">
            Content
          </Child>
        </Component>
      </Parent>
    )

    expect(expected).not.toBeNull()
    if (key in KNOWN_FAILURES) {
      expect(actual, `${key} ${STILL_FAILS}`).not.toEqual(expected)
    } else {
      expect(actual).toEqual(expected)
    }
  })
})

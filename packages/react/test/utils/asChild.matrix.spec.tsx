import * as React from 'react'
import fs from 'node:fs'
import path from 'node:path'
import { render, screen } from '@testing-library/react'

import * as library from '../../src/index'
import { STILL_FAILS } from '../ssr/stories'

// `asChild` with an `<a>` child must render what `component="a"` renders: the same classes and the
// same semantics (role, disabled handling, aria state). This runs every polymorphic component
// through both, with and without `disabled`, and compares the attributes that carry them.
//
// The list is every `createPolymorphicComponent` call under `src/components`, read from source, so
// a new polymorphic component is covered without editing this file.
const POLYMORPHIC = fs
  .readdirSync(path.resolve(__dirname, '../../src/components'), {
    recursive: true,
    encoding: 'utf8'
  })
  .filter((file) => file.endsWith('.tsx'))
  .flatMap((file) => {
    const source = fs.readFileSync(path.resolve(__dirname, '../../src/components', file), 'utf8')
    return [...source.matchAll(/export const (\w+) = createPolymorphicComponent/g)].map(
      (match) => match[1] as string
    )
  })
  .sort()

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

// F2 of AUDIT-PLAN.md: `asChild` takes the "trusted component reference" path, so a slotted `<a>`
// skips the component's own anchor handling. B2 fixes these; delete each entry with its fix.
const KNOWN_FAILURES: Record<string, string> = {
  'Avatar disabled': 'F2: `disabled` attribute instead of aria-disabled/tabindex',
  'Button disabled': 'F2: `disabled` attribute instead of aria-disabled/tabindex',
  'CardLink disabled': 'F2: no aria-disabled/tabindex',
  'Chip disabled': 'F2: no tabindex',
  CloseButton: 'F2: loses its classes',
  'CloseButton disabled': 'F2: loses its classes and disabled handling',
  'Link disabled': 'F2: no aria-disabled/tabindex',
  ListItem: 'F2: no `list-action` class',
  'ListItem disabled': 'F2: no `list-action` class, no tabindex',
  'MenuItem disabled': 'F2: no aria-disabled/tabindex',
  'NavLink disabled': 'F2: no aria-disabled/tabindex',
  'PaginationItem disabled': 'F2: no aria-disabled/tabindex',
  Placeholder: 'F2: ignores the child and renders its default <svg>',
  'Placeholder disabled': 'F2: ignores the child and renders its default <svg>'
}

// Components that throw outside their parent are rendered inside it.
const PARENTS: Record<string, React.ElementType> = {
  CarouselInner: library.Carousel
}

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

const cases = POLYMORPHIC.flatMap((name) => [
  { name, disabled: false, key: name },
  { name, disabled: true, key: `${name} disabled` }
])

describe('asChild with an <a> child renders what component="a" renders', () => {
  test('finds every polymorphic component', () => {
    expect(POLYMORPHIC).toHaveLength(70)
    for (const name of POLYMORPHIC) expect(library).toHaveProperty(name)
  })

  test('lists only cases that exist', () => {
    const keys = new Set(cases.map(({ key }) => key))
    expect(Object.keys(KNOWN_FAILURES).filter((key) => !keys.has(key))).toEqual([])
  })

  test.for(cases)('$key', ({ name, disabled, key }) => {
    const Component = (library as unknown as Record<string, React.ElementType>)[name]!
    const Parent = PARENTS[name] ?? React.Fragment
    const extra = disabled ? { disabled: true } : {}

    const expected = attributesOf(
      <Parent>
        <Component component="a" href="/target" data-testid="subject" {...extra}>
          Content
        </Component>
      </Parent>
    )
    const actual = attributesOf(
      <Parent>
        <Component asChild {...extra}>
          <a href="/target" data-testid="subject">
            Content
          </a>
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

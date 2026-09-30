// @vitest-environment node
import * as React from 'react'
import fs from 'node:fs'
import path from 'node:path'
import { renderToStaticMarkup as toStaticMarkup } from 'react-dom/server'

import * as library from '../../src/index'
import { misplacedHrefs } from './misplacedHrefs'

// One rule for `href` (`linkElement` and `hrefProps` in `src/utils/elementKind.ts`): a component
// given `href` renders an `<a>`, unless `component` or `asChild` chose the element, and `href`
// reaches only an element that can take it, an `<a>` or a component reference such as a router
// link. This renders every component that takes `href` each way and reads the markup.

// Stands in for a router link (e.g. `next/link`): it renders an `<a>` and forwards its props.
function RouterLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a data-router="" {...props} />
}

const Library = library as unknown as Record<string, React.ElementType>

// Every component that takes an `href` of its own. Each renders standalone except `MenuToggle`,
// which needs its `Menu`.
const COMPONENTS = [
  'Avatar',
  'BreadcrumbItem',
  'Button',
  'CardLink',
  'Chip',
  'CloseButton',
  'Link',
  'ListItem',
  'MenuItem',
  'MenuToggle',
  'NavItem',
  'NavLink',
  'NavbarBrand',
  'PaginationItem',
  'StepperItem'
]
const PARENTS: Record<string, React.ElementType> = { MenuToggle: library.Menu }

// `BreadcrumbItem` isn't polymorphic: `href` is its inner link's, and it has no `component`.
const WITHOUT_COMPONENT = new Set(['BreadcrumbItem'])

// Components whose `items` take an `href`, each with the items it's rendered with.
const LINKED_ITEMS = [{ label: 'Linked', href: '/target' }, { label: 'Plain' }]
const DATA_DRIVEN: Record<string, Record<string, unknown>> = {
  AvatarStack: { items: [{ href: '/target', content: 'L' }, { content: 'P' }] },
  Breadcrumb: { items: [...LINKED_ITEMS, { label: 'Last' }] },
  List: { items: LINKED_ITEMS },
  MenuList: {
    items: [
      { id: 'linked', label: 'Linked', href: '/target' },
      { id: 'plain', label: 'Plain' }
    ]
  },
  Nav: { items: LINKED_ITEMS },
  Stepper: { items: LINKED_ITEMS }
}

function markupOf(name: string, props: Record<string, unknown>) {
  const Component = Library[name]!
  const Parent = PARENTS[name] ?? React.Fragment
  const warnings: string[] = []
  const consoleWarn = vi.spyOn(console, 'warn').mockImplementation((message) => {
    warnings.push(String(message))
  })
  try {
    const markup = toStaticMarkup(
      <Parent>
        <Component {...props}>Content</Component>
      </Parent>
    )
    return { markup, warnings }
  } finally {
    consoleWarn.mockRestore()
  }
}

const IGNORED = /`href` was ignored/

describe('one rule for href', () => {
  // Read from the generated prop tables, which include props inherited from `LinkProps`. CI
  // regenerates them and fails when they're stale (`pnpm react:check:api-docs`).
  test('lists every component whose props include href', () => {
    const root = path.resolve(__dirname, '../../../site/content/api')
    const withHref = fs
      .readdirSync(root)
      .filter((file) => file.endsWith('.json') && !file.endsWith('Def.json'))
      .filter((file) => {
        const doc = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
        return 'href' in (doc.props ?? {})
      })
      .map((file) => path.basename(file, '.json'))
      .sort()
    expect(withHref).toEqual([...COMPONENTS].sort())
  })

  describe.for(COMPONENTS)('%s', (name) => {
    test('renders an <a> for href', () => {
      const { markup, warnings } = markupOf(name, { href: '/target' })
      expect(markup).toMatch(/<a\b[^>]*\shref="\/target"/)
      expect(misplacedHrefs(markup)).toEqual([])
      expect(warnings).toEqual([])
    })

    test.skipIf(WITHOUT_COMPONENT.has(name))(
      'passes href to a router link given as component',
      () => {
        const { markup, warnings } = markupOf(name, { component: RouterLink, href: '/target' })
        expect(markup).toMatch(/<a data-router=""[^>]*\shref="\/target"/)
        expect(warnings).toEqual([])
      }
    )

    test.skipIf(WITHOUT_COMPONENT.has(name)).for(['div', 'button'])(
      'drops href on component="%s", and says so',
      (tag) => {
        const { markup, warnings } = markupOf(name, { component: tag, href: '/target' })
        expect(markup).toContain(`<${tag}`)
        expect(markup).not.toContain('href=')
        expect(warnings).toEqual([expect.stringMatching(IGNORED)])
      }
    )
  })

  describe.for(Object.keys(DATA_DRIVEN))('%s items', (name) => {
    test('render an <a> for an item with href, and nothing else carries one', () => {
      const { markup, warnings } = markupOf(name, DATA_DRIVEN[name]!)
      expect(markup).toMatch(/<a\b[^>]*\shref="\/target"/)
      expect(misplacedHrefs(markup)).toEqual([])
      expect(warnings).toEqual([])
    })
  })

  // A parent that picks its root from its children has to see an item's `href`: an `<a>` isn't
  // allowed directly inside the `<ul>` or `<ol>` it renders otherwise.
  test.for([
    ['List', 'ListItem'],
    ['Stepper', 'StepperItem']
  ])('%s holds a linked %s in a <div>', ([parent, item]) => {
    const Parent = Library[parent!]!
    const Item = Library[item!]!
    const markup = toStaticMarkup(
      <Parent>
        <Item href="/target">Linked</Item>
        <Item>Plain</Item>
      </Parent>
    )
    expect(markup).toMatch(
      /^<div class="(list|stepper)"><a class="[^"]*" href="\/target">Linked<\/a><div /
    )
  })

  test('misplacedHrefs finds href on anything but a link', () => {
    expect(
      misplacedHrefs('<li href="/a"></li><a href="/b"></a><svg><use href="#i"></use></svg>')
    ).toEqual(['li'])
  })
})

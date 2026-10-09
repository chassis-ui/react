import fs from 'fs'
import path from 'path'
import { createElement, ElementType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Card, CardBody, Flex, Grid, GridItem, Skeleton, Stack } from '../../src/index'
import type { FlexProps, GridFlow } from '../../src/index'
import { SPACING } from '../../src/types'
import { BREAKPOINTS, GRID_BREAKPOINTS } from '../../src/utils/breakpoints'

// In the Tailwind entry of chassis-css a utility has a rule only where Tailwind's scanner finds
// its whole name in a source file. A name joined at runtime (`bg-${color}`) is never found, so
// the class renders with no rule and nothing warns. A component maps a prop to whole class names
// instead, from a condition or a table (see `src/utils/colorClassNames.ts`), which the scanner
// reads out of `dist` once a project registers the package with `@source`.
//
// This sweep reads every template literal in `src/` and fails on one that can spell a utility of
// the Tailwind entry, unless it is listed below. Each entry must keep matching: one whose
// template is gone fails "lists only templates that exist" until it is deleted from here.
//
// A template is keyed by its file and its text with every interpolation as `{}`. The sweep
// cannot see a name with no part of its own (`${prefix}${base}-${value}` in
// `utils/spacingClassName.ts`, which builds the gap classes of the layout props).

// The classes of the layout props. They are too many to write out at every breakpoint and
// container prefix, so a Tailwind build loads the opt-in safelist of chassis-css for them
// (`@chassis-ui/css/tailwind/safelist.css`), which lists every one.
const SAFELISTED = 'layout prop, in the safelist of chassis-css'

const BUILT: Record<string, string> = {
  'components/flex/Flex.tsx: {}flex-{}': SAFELISTED,
  'components/flex/Flex.tsx: {}justify-content-{}': SAFELISTED,
  'components/flex/Flex.tsx: {}align-items-{}': SAFELISTED,
  'components/flex/Flex.tsx: {}align-content-{}': SAFELISTED,
  'components/grid/Grid.tsx: {}grid-cols-{}': SAFELISTED,
  'components/grid/Grid.tsx: {}grid-rows-{}': SAFELISTED,
  'components/grid/Grid.tsx: {}grid-flow-{}': SAFELISTED,
  'components/grid/GridItem.tsx: {}col-span-{}': SAFELISTED,
  'components/grid/GridItem.tsx: {}col-start-{}': SAFELISTED,
  'components/grid/GridItem.tsx: {}col-end-{}': SAFELISTED,
  'components/grid/GridItem.tsx: {}row-span-{}': SAFELISTED,
  'components/grid/GridItem.tsx: {}row-start-{}': SAFELISTED,
  'components/grid/GridItem.tsx: {}row-end-{}': SAFELISTED,
  'components/grid/GridItem.tsx: grid-rows-{}': SAFELISTED,
  'components/grid/gap.ts: {}gap-{}': SAFELISTED,
  'components/skeleton/Skeleton.tsx: {}flex-fill': SAFELISTED,
  'components/skeleton/Skeleton.tsx: {}w-auto': SAFELISTED,
  'components/skeleton/Skeleton.tsx: {}w-100': SAFELISTED,
  'components/skeleton/Skeleton.tsx: {}w-{}/12': SAFELISTED,
  'utils/breakpoints.ts: {}flex-{}': SAFELISTED,
  // Component classes, which the Tailwind entry ships whole. They only share a prefix with a
  // utility (`skeleton-primary`, `spinner-sm`).
  'components/skeleton/Skeleton.tsx: skeleton-{}':
    'skeleton-glow, skeleton-wave: component classes',
  'components/spinner/Spinner.tsx: spinner-{}': 'spinner-border, spinner-grow: component classes',
  'components/spinner/Spinner.tsx: spinner-{}-{}': 'spinner-border-sm, spinner-grow-sm: no utility'
}

const SRC = path.resolve(__dirname, '../../src')
const UTILITIES_CSS = path.resolve(
  __dirname,
  '../../node_modules/@chassis-ui/css/dist/tailwind/utilities.css'
)

// The names of the `@utility` rules of the Tailwind entry, and one name of each family of the
// grid placement classes, which are Tailwind core's own utilities there.
const utilityNames = (): string[] => [
  ...Array.from(fs.readFileSync(UTILITIES_CSS, 'utf8').matchAll(/^@utility ([^\s{]+)/gm), (m) =>
    (m[1] ?? '').replace(/\\/g, '')
  ),
  'col-span-1',
  'col-start-1',
  'col-end-1',
  'row-span-1',
  'row-start-1',
  'row-end-1'
]

const TEMPLATE = /`[^`]*\$\{[^`]*`/g
const INTERPOLATION = /\$\{[^}]*\}/g
const HOLE = '\u0000'

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

// The names a class token of a template can spell: a leading interpolation is a breakpoint
// prefix or nothing, any other one is a part of the name.
const tokenPattern = (token: string): RegExp =>
  new RegExp(
    `^${token
      .split(HOLE)
      .map(escapeRegExp)
      .join('[\\w./-]+')
      .replace(/^\[\\w\.\/-\]\+/, '(?:[@\\w]+:)?')}$`
  )

// Every class token with an interpolation, in a template literal outside a comment.
const builtTokens = (): string[] => {
  const tokens = new Set<string>()
  const files = fs
    .readdirSync(SRC, { recursive: true, encoding: 'utf8' })
    .filter((file) => /\.tsx?$/.test(file))

  for (const file of files) {
    const lines = fs
      .readFileSync(path.join(SRC, file), 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => !/^(\/\/|\*|\/\*)/.test(line))

    for (const line of lines) {
      for (const [template] of line.matchAll(TEMPLATE)) {
        for (const token of template.slice(1, -1).replace(INTERPOLATION, HOLE).split(/\s+/)) {
          // A name needs a part of its own (`w-`, `bg-`) for the sweep to tell what it spells.
          if (token.includes(HOLE) && /[a-z][a-z-]/.test(token)) {
            tokens.add(`${file.split(path.sep).join('/')}: ${token.split(HOLE).join('{}')}`)
          }
        }
      }
    }
  }
  return [...tokens]
}

describe('class names of the Tailwind entry', () => {
  const names = utilityNames()
  const spellsUtility = (key: string) => {
    const pattern = tokenPattern(
      key
        .slice(key.indexOf(': ') + 2)
        .split('{}')
        .join(HOLE)
    )
    return names.some((name) => pattern.test(name))
  }
  const built = builtTokens().filter(spellsUtility)

  test('reads the utilities of the Tailwind entry and the templates of src', () => {
    expect(names).toContain('bg-primary')
    expect(names).toContain('w-1/12')
    expect(names.length).toBeGreaterThan(1000)
    expect(built.length).toBeGreaterThan(0)
  })

  test('no component builds the name of a utility from parts', () => {
    expect(built.filter((key) => !(key in BUILT))).toEqual([])
  })

  test('lists only templates that exist', () => {
    expect(Object.keys(BUILT).filter((key) => !built.includes(key))).toEqual([])
  })
})

// The other half of the rule: the names the layout props do build have to be in the safelist a
// Tailwind build loads for them. A prop that gains a value chassis-css does not list would render
// a class with no rule.

const SAFELIST_CSS = path.resolve(
  __dirname,
  '../../node_modules/@chassis-ui/css/dist/tailwind/safelist.css'
)

// Expands the brace groups of an `@source inline()` pattern as Tailwind does: a list (`{a,b}`,
// with an empty item for the unprefixed name) or a range (`{1..12}`).
const expand = (pattern: string): string[] => {
  const group = /\{([^{}]*)\}/.exec(pattern)
  if (!group) return [pattern]

  const body = group[1] ?? ''
  const range = /^(\d+)\.\.(\d+)$/.exec(body)
  const items = range
    ? Array.from({ length: Number(range[2]) - Number(range[1]) + 1 }, (_, i) =>
        String(Number(range[1]) + i)
      )
    : body.split(',')

  const head = pattern.slice(0, group.index)
  const tail = pattern.slice(group.index + group[0].length)
  return items.flatMap((item) => expand(head + item + tail))
}

const safelisted = (): Set<string> =>
  new Set(
    Array.from(
      fs.readFileSync(SAFELIST_CSS, 'utf8').matchAll(/@source inline\("([^"]+)"\);/g),
      (m) => m[1] ?? ''
    ).flatMap(expand)
  )

// The values of a prop, written as the keys of a record of its type: a value added to the type
// fails the type check here until it is listed, and so tested.
type Value<P> = Exclude<P, object | undefined>
const valuesOf = <T extends string>(values: Record<T, true>) => Object.keys(values) as T[]
const count = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i)

const FLOW = valuesOf<GridFlow>({
  row: true,
  column: true,
  dense: true,
  'row-dense': true,
  'column-dense': true
})
const DIRECTION = valuesOf<Value<FlexProps['direction']>>({
  row: true,
  column: true,
  'row-reverse': true,
  'column-reverse': true
})
const WRAP = valuesOf<Value<FlexProps['wrap']>>({ wrap: true, nowrap: true, 'wrap-reverse': true })
const JUSTIFY = valuesOf<Value<FlexProps['justify']>>({
  start: true,
  end: true,
  center: true,
  between: true,
  around: true,
  evenly: true
})
const ALIGN = valuesOf<Value<FlexProps['align']>>({
  start: true,
  end: true,
  center: true,
  baseline: true,
  stretch: true
})
const ALIGN_CONTENT = valuesOf<Value<FlexProps['alignContent']>>({
  start: true,
  end: true,
  center: true,
  between: true,
  around: true,
  stretch: true
})
const GAP = [...SPACING, 0]

// `PLAIN` is the value with no key, the only form of a prop that takes no breakpoint.
const PLAIN = ['plain']
const VIEWPORT = [...PLAIN, 'base', ...BREAKPOINTS]
const CONTAINER = [...PLAIN, 'base', ...GRID_BREAKPOINTS]

type LayoutProp = {
  component: ElementType
  prop: string
  keys: string[]
  values: unknown[]
  // Props the one under test needs to render a class at all.
  with?: Record<string, unknown>
}

const LAYOUT_PROPS: LayoutProp[] = [
  { component: Grid, prop: 'columns', keys: CONTAINER, values: count(1, 12) },
  { component: Grid, prop: 'rows', keys: CONTAINER, values: count(1, 6) },
  { component: Grid, prop: 'gap', keys: CONTAINER, values: [...SPACING] },
  { component: Grid, prop: 'flow', keys: CONTAINER, values: FLOW },
  { component: GridItem, prop: 'span', keys: CONTAINER, values: [...count(1, 12), 'full'] },
  { component: GridItem, prop: 'start', keys: CONTAINER, values: [...count(1, 12), 'auto'] },
  { component: GridItem, prop: 'end', keys: CONTAINER, values: [...count(1, 13), 'auto'] },
  { component: GridItem, prop: 'rowSpan', keys: CONTAINER, values: count(1, 6) },
  { component: GridItem, prop: 'rowStart', keys: CONTAINER, values: [...count(1, 6), 'auto'] },
  { component: GridItem, prop: 'rowEnd', keys: CONTAINER, values: [...count(1, 7), 'auto'] },
  {
    component: GridItem,
    prop: 'rows',
    keys: PLAIN,
    values: count(1, 6),
    with: { subgrid: true }
  },
  {
    component: GridItem,
    prop: 'gap',
    keys: PLAIN,
    values: [...SPACING],
    with: { subgrid: true }
  },
  { component: Flex, prop: 'direction', keys: VIEWPORT, values: DIRECTION },
  { component: Flex, prop: 'wrap', keys: VIEWPORT, values: WRAP },
  { component: Flex, prop: 'justify', keys: VIEWPORT, values: JUSTIFY },
  { component: Flex, prop: 'align', keys: VIEWPORT, values: ALIGN },
  { component: Flex, prop: 'alignContent', keys: VIEWPORT, values: ALIGN_CONTENT },
  { component: Flex, prop: 'gap', keys: VIEWPORT, values: GAP },
  { component: Flex, prop: 'rowGap', keys: VIEWPORT, values: GAP },
  { component: Flex, prop: 'columnGap', keys: VIEWPORT, values: GAP },
  { component: Stack, prop: 'gap', keys: PLAIN, values: GAP },
  { component: Card, prop: 'direction', keys: VIEWPORT, values: ['row', 'column'] },
  { component: CardBody, prop: 'direction', keys: VIEWPORT, values: ['row', 'column'] },
  { component: CardBody, prop: 'gap', keys: PLAIN, values: GAP },
  { component: Skeleton, prop: 'span', keys: VIEWPORT, values: [...count(1, 12), 'auto', true] }
]

const classesOf = (component: ElementType, props: Record<string, unknown>): string[] =>
  (/class="([^"]*)"/.exec(renderToStaticMarkup(createElement(component, props)))?.[1] ?? '')
    .split(/\s+/)
    .filter(Boolean)

// The classes a prop adds to its component, for every value at every key it takes.
const layoutClasses = ({ component, prop, keys, values, with: others = {} }: LayoutProp) => {
  const fixed = new Set(classesOf(component, others))
  return keys.flatMap((key) =>
    values.flatMap((value) =>
      classesOf(component, { ...others, [prop]: key === 'plain' ? value : { [key]: value } })
        .filter((className) => !fixed.has(className))
        .map((className) => ({ className, from: `${prop}=${String(value)} at ${key}` }))
    )
  )
}

describe('class names of the layout props', () => {
  const safelist = safelisted()
  const rendered = LAYOUT_PROPS.flatMap(layoutClasses)

  test('reads the safelist of chassis-css and renders the layout props', () => {
    expect(safelist.has('md:col-span-3')).toBe(true)
    expect(safelist.has('@lg:grid-cols-4')).toBe(true)
    expect(new Set(rendered.map(({ className }) => className)).size).toBeGreaterThan(1400)
  })

  test.each(LAYOUT_PROPS.map((layoutProp) => [layoutProp.prop, layoutProp] as const))(
    '%s renders a class for every value at every key',
    (_prop, layoutProp) => {
      const classes = layoutClasses(layoutProp)
      // A value with a default (a card is a column) adds no class of its own at the base.
      expect(classes.length).toBeGreaterThanOrEqual(
        (layoutProp.keys.length - 2) * layoutProp.values.length
      )
    }
  )

  test('every class a layout prop renders is in the safelist', () => {
    const missing = rendered.filter(({ className }) => !safelist.has(className))
    expect(missing.map(({ className, from }) => `${className} (${from})`)).toEqual([])
  })
})

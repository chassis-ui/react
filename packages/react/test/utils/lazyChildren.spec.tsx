import * as React from 'react'
import fs from 'node:fs'
import path from 'node:path'
import { act, render } from '@testing-library/react'
// Aliased: testing-library's lint rules treat any `render*` call's result as a `render()` result.
import { renderToString as toHtml } from 'react-dom/server'

import {
  Button,
  Combobox,
  ComboboxGroup,
  ComboboxItem,
  IconProvider,
  List,
  ListItem,
  Nav,
  NavbarToggler,
  NavItem,
  NavOverflow,
  Popover,
  Stepper,
  StepperItem,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tooltip
} from '../../src/index'
import { STILL_FAILS } from '../ssr/stories'
import { lazyNode, lazyType, pendingLazyNode } from './lazyNode'

// A component given its children the way React Server Components deliver them (see
// `lazyNode.ts`) must render the same markup as with plain elements, without throwing. Each case
// runs with its children as lazy nodes, and with plain children whose types are lazy wrappers.
type Wrap = (element: React.ReactElement) => React.ReactElement

const CASES: Record<string, (wrap: Wrap) => React.ReactElement> = {
  'asChild (Slot)': (wrap) => <Button asChild>{wrap(<a href="/login">Log in</a>)}</Button>,
  'asChild item in a List': (wrap) => (
    <List>
      <ListItem asChild>{wrap(<a href="/a">A</a>)}</ListItem>
      <ListItem>B</ListItem>
    </List>
  ),
  Tooltip: (wrap) => <Tooltip content="Tip">{wrap(<Button>Trigger</Button>)}</Tooltip>,
  Popover: (wrap) => <Popover content="Body">{wrap(<Button>Trigger</Button>)}</Popover>,
  Tabs: (wrap) => (
    <Tabs defaultSelectedKey="a">
      {wrap(
        <TabList aria-label="Sections">
          {wrap(<Tab id="a">A</Tab>)}
          {wrap(<Tab id="b">B</Tab>)}
        </TabList>
      )}
      {wrap(<TabPanel id="a">Panel A</TabPanel>)}
      {wrap(<TabPanel id="b">Panel B</TabPanel>)}
    </Tabs>
  ),
  // `Tabs` looks for its `TabList` inside the element that holds it.
  'Tabs with its list in a NavOverflow': (wrap) => (
    <Tabs defaultSelectedKey="a">
      {wrap(
        <NavOverflow>
          {wrap(
            <TabList aria-label="Sections">
              {wrap(<Tab id="a">A</Tab>)}
              {wrap(<Tab id="b">B</Tab>)}
            </TabList>
          )}
        </NavOverflow>
      )}
      {wrap(<TabPanel id="a">Panel A</TabPanel>)}
    </Tabs>
  ),
  NavOverflow: (wrap) => (
    <NavOverflow>
      {wrap(
        <Nav>
          {wrap(<NavItem href="/a">A</NavItem>)}
          {wrap(
            <NavItem asChild>
              <a href="/b">B</a>
            </NavItem>
          )}
        </Nav>
      )}
    </NavOverflow>
  ),
  List: (wrap) => (
    <List>
      {wrap(<ListItem>A</ListItem>)}
      {wrap(<ListItem>B</ListItem>)}
    </List>
  ),
  'List with a link item': (wrap) => (
    <List>
      {wrap(
        <ListItem component="a" href="/a">
          A
        </ListItem>
      )}
      {wrap(<ListItem>B</ListItem>)}
    </List>
  ),
  Stepper: (wrap) => (
    <Stepper>
      {wrap(<StepperItem>First</StepperItem>)}
      {wrap(<StepperItem active>Second</StepperItem>)}
    </Stepper>
  ),
  'Stepper with a link step': (wrap) => (
    <Stepper>
      {wrap(
        <StepperItem component="a" href="/cart">
          Cart
        </StepperItem>
      )}
      {wrap(<StepperItem active>Payment</StepperItem>)}
    </Stepper>
  ),
  Combobox: (wrap) => (
    <Combobox aria-label="Fruit" defaultValue="cherry">
      {wrap(<ComboboxItem id="apple">Apple</ComboboxItem>)}
      {wrap(
        <ComboboxGroup label="Stone fruit">
          {wrap(<ComboboxItem id="cherry">Cherry</ComboboxItem>)}
        </ComboboxGroup>
      )}
    </Combobox>
  ),
  'icon element': (wrap) => (
    <IconProvider icons={{ menu: wrap(<svg data-custom-icon="" />) }}>
      <NavbarToggler />
    </IconProvider>
  )
}

// Cases known to fail, each with its reason. Empty today; a case listed here is expected to fail,
// so an entry has to be deleted with its fix.
const KNOWN_FAILURES: Record<string, string> = {}

const FORMS: Record<string, Wrap> = { 'lazy nodes': lazyNode, 'lazy types': lazyType }

// react-aria's generated ids differ between two renders in one document.
const normalizeIds = (html: string) => html.replace(/(react-aria-?)?_r_[0-9a-z]+_/gi, 'ID')

function markup(element: React.ReactElement): string {
  // Hand-built lazy nodes carry no key, so React warns about keys when several are siblings. A
  // real Flight payload doesn't hit that, so it isn't part of what's asserted.
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
  const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  try {
    const { container, unmount } = render(element)
    const html = normalizeIds(container.innerHTML)
    unmount()
    return html
  } catch (error) {
    return `threw: ${error instanceof Error ? error.message : String(error)}`
  } finally {
    consoleError.mockRestore()
    consoleWarn.mockRestore()
  }
}

const cases = Object.entries(CASES).flatMap(([name, build]) =>
  Object.entries(FORMS).map(([form, wrap]) => ({ name, build, wrap, key: `${name}, ${form}` }))
)

// `child.type === ListItem` is false for a child written in a Server Component, whose type is a
// lazy wrapper. `isElementOfType` (`src/utils/lazyElement.ts`) resolves it first.
const TYPE_COMPARISON = /\.type [!=]== [A-Z]/

describe('children from Server Components', () => {
  test('no component compares the type of a child to a component', () => {
    const root = path.resolve(__dirname, '../../src')
    const offenders = fs
      .readdirSync(root, { recursive: true, encoding: 'utf8' })
      .filter((file) => /\.tsx?$/.test(file) && file !== path.join('utils', 'lazyElement.ts'))
      .flatMap((file) =>
        fs
          .readFileSync(path.join(root, file), 'utf8')
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => TYPE_COMPARISON.test(line) && !/^(\/\/|\*)/.test(line))
          .map((line) => `${file}: ${line}`)
      )
    // `Fragment` is React's own symbol, never a client component, so it is never lazy.
    expect(offenders.filter((line) => !line.includes('.type !== Fragment'))).toEqual([])
  })

  test('lists only cases that exist', () => {
    const keys = new Set(cases.map(({ key }) => key))
    expect(Object.keys(KNOWN_FAILURES).filter((key) => !keys.has(key))).toEqual([])
  })

  test.for(cases)('$key', ({ build, wrap, key }) => {
    const plain = markup(build((element) => element))
    const lazy = markup(build(wrap))

    expect(plain).not.toMatch(/^threw/)
    if (key in KNOWN_FAILURES) {
      expect(lazy, `${key} ${STILL_FAILS}`).not.toBe(plain)
    } else {
      expect(lazy).toBe(plain)
    }
  })

  test.for(cases)('$key, rendered on the server', ({ build, wrap, key }) => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const plain = normalizeIds(toHtml(build((element) => element)))
    const lazy = normalizeIds(toHtml(build(wrap)))
    consoleWarn.mockRestore()
    consoleError.mockRestore()

    if (key in KNOWN_FAILURES) {
      expect(lazy, `${key} ${STILL_FAILS}`).not.toBe(plain)
    } else {
      expect(lazy).toBe(plain)
    }
  })
})

// A child that is still loading suspends the component that reads it, instead of making it fall
// back to its default element (#37) or throw. React renders it once the child is there.
describe('a child that is still loading', () => {
  const PENDING: Record<string, (child: React.ReactElement) => React.ReactElement> = {
    'asChild (Slot)': (child) => <Button asChild>{child}</Button>,
    Tooltip: (child) => <Tooltip content="Tip">{child}</Tooltip>,
    Popover: (child) => <Popover content="Body">{child}</Popover>
  }

  test.for(Object.entries(PENDING))('%s', async ([, build]) => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const child = <a href="/login">Log in</a>
    const plain = markup(build(child))
    const { node, resolve } = pendingLazyNode(child)

    const { container, unmount } = render(
      <React.Suspense fallback={<p>Loading</p>}>{build(node)}</React.Suspense>
    )
    expect(container).toHaveTextContent('Loading')
    expect(container).not.toHaveTextContent('Log in')

    await act(resolve)
    expect(normalizeIds(container.innerHTML)).toBe(plain)
    expect(consoleWarn).not.toHaveBeenCalled()
    unmount()
    consoleWarn.mockRestore()
  })
})

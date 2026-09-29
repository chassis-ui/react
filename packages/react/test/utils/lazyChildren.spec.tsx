import * as React from 'react'
import { render } from '@testing-library/react'

import {
  Button,
  List,
  ListItem,
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
import { lazyNode } from './lazyNode'

// A component given its children as lazy nodes, as React Server Components deliver them (see
// `lazyNode.ts`), must render the same markup as with plain elements, without throwing.
type Wrap = (element: React.ReactElement) => React.ReactElement

const CASES: Record<string, (wrap: Wrap) => React.ReactElement> = {
  'asChild (Slot)': (wrap) => <Button asChild>{wrap(<a href="/login">Log in</a>)}</Button>,
  Tooltip: (wrap) => <Tooltip content="Tip">{wrap(<Button>Trigger</Button>)}</Tooltip>,
  Popover: (wrap) => <Popover content="Body">{wrap(<Button>Trigger</Button>)}</Popover>,
  Tabs: (wrap) => (
    <Tabs defaultSelectedKey="a">
      {wrap(
        <TabList aria-label="Sections">
          <Tab id="a">A</Tab>
          <Tab id="b">B</Tab>
        </TabList>
      )}
      {wrap(<TabPanel id="a">Panel A</TabPanel>)}
      {wrap(<TabPanel id="b">Panel B</TabPanel>)}
    </Tabs>
  ),
  List: (wrap) => (
    <List>
      {wrap(<ListItem>A</ListItem>)}
      {wrap(<ListItem>B</ListItem>)}
    </List>
  ),
  Stepper: (wrap) => (
    <Stepper>
      {wrap(<StepperItem>First</StepperItem>)}
      {wrap(<StepperItem active>Second</StepperItem>)}
    </Stepper>
  )
}

// F3 of AUDIT-PLAN.md (#37). B3 fixes these; delete each entry with its fix.
const KNOWN_FAILURES: Record<string, string> = {
  'asChild (Slot)': 'F3: falls back to the default <button> around the child',
  Tooltip: "F3: throws reading the trigger's ref",
  Popover: "F3: throws reading the trigger's ref"
}

// react-aria's generated ids differ between two renders in one document.
const normalizeIds = (html: string) => html.replace(/(react-aria-)?_r_[0-9a-z]+_/g, 'ID')

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

describe('lazy children from Server Components', () => {
  test.for(Object.entries(CASES))('%s', ([name, build]) => {
    const plain = markup(build((element) => element))
    const lazy = markup(build(lazyNode))

    expect(plain).not.toMatch(/^threw/)
    if (name in KNOWN_FAILURES) {
      expect(lazy, `${name} ${STILL_FAILS}`).not.toBe(plain)
    } else {
      expect(lazy).toBe(plain)
    }
  })
})

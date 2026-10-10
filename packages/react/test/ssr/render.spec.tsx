// @vitest-environment node
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { JSDOM } from 'jsdom'
import { within } from '@testing-library/react'

import { danglingReferences } from '../utils/danglingReferences'
import { misplacedHrefs } from '../utils/misplacedHrefs'
import { loadFirstPaintCases } from './firstPaint'
import { loadStories } from './stories'

// Server render sweep: every story rendered with `renderToString` in a real Node environment, with
// no `window` or `document`, as a framework's server does. A story fails if rendering throws or
// logs a `console.error` (a `useLayoutEffect` on the server, an invalid prop, a missing key), if
// its markup has an `href` on anything but a link (see `test/utils/href.matrix.spec.tsx`), or if
// it refers to an id no element in it has.
//
// No story fails today. A known failure would go in an allowlist keyed by story id, as in
// `hydrate.spec.tsx`.
const stories = await loadStories()
const cases = await loadFirstPaintCases()

function toServerHtml(element: React.ReactElement): string {
  const errors: unknown[] = []
  const consoleError = vi.spyOn(console, 'error').mockImplementation((...args) => {
    errors.push(args[0])
  })
  let markup = ''
  try {
    expect(() => (markup = renderToString(element))).not.toThrow()
  } finally {
    consoleError.mockRestore()
  }
  expect(errors).toEqual([])
  return markup
}

describe('server render of every story', () => {
  test('finds the stories', () => {
    expect(typeof window).toBe('undefined')
    expect(stories.length).toBeGreaterThan(250)
  })

  test.for(stories.map(({ id, Story }) => [id, Story] as const))('%s', ([, Story]) => {
    const markup = toServerHtml(<Story />)
    expect(misplacedHrefs(markup)).toEqual([])
    expect(danglingReferences(markup)).toEqual([])
  })
})

// What the server's HTML shows before any JavaScript has run: it should be what the page settles
// to after hydration, except for what only a browser can know (a position, the viewer's time
// zone) or render (a portal).
describe('first paint on the server', () => {
  // The case's server HTML, parsed into a document of its own. Query it with `within`.
  function firstPaint(name: string): HTMLElement {
    const markup = toServerHtml(cases[name]!())
    expect(danglingReferences(markup)).toEqual([])
    return new JSDOM(`<!doctype html><body>${markup}</body>`).window.document.body
  }

  test('Tabs with no key given selects its first enabled tab and renders its panel', () => {
    const page = within(firstPaint('Tabs with no key given'))
    const tab = page.getByRole('tab', { name: 'Two' })
    expect(tab).toHaveAttribute('aria-selected', 'true')
    // The tab stop, so Tab reaches the list before hydration.
    expect(tab).toHaveAttribute('tabindex', '0')
    expect(page.getByRole('tabpanel')).toHaveTextContent('Panel two')
  })

  test('a disabled tab is never the tab stop, even selected', () => {
    const tab = within(firstPaint('Tabs with every tab disabled')).getByRole('tab', { name: 'One' })
    expect(tab).toHaveAttribute('aria-selected', 'true')
    expect(tab).not.toHaveAttribute('tabindex')
  })

  test('a Modal rendered open is open in the server HTML', () => {
    const page = within(firstPaint('Modal rendered open'))
    expect(page.getByRole('dialog', { name: 'Title' })).toHaveAttribute('open')
  })

  test('a Toast shown on its first render is settled, with show', () => {
    const page = within(firstPaint('Toast shown'))
    expect(page.getByRole('status')).toHaveClass('toast', 'fade', 'show')
  })

  test('a Notification shown on its first render is settled, with show', () => {
    const page = within(firstPaint('Notification shown'))
    expect(page.getByRole('status')).toHaveClass('notification', 'fade', 'show')
  })

  test('Carousel renders an indicator per slide and marks the active slide', () => {
    const page = within(firstPaint('Carousel with indicators'))
    const indicators = page.getAllByRole('button', { name: /^Slide/ })
    expect(indicators).toHaveLength(3)
    expect(indicators[1]).toHaveAttribute('aria-current', 'true')
    const active = page.getByRole('group', { name: '2 of 3' })
    expect(active).toHaveClass('carousel-item', 'active')
    expect(active).toHaveAttribute('aria-roledescription', 'slide')
    expect(page.getByRole('group', { name: '1 of 3' })).not.toHaveClass('active')
  })

  test('a CarouselInner inside a component of your own counts its own slides', () => {
    const page = within(firstPaint('Carousel inside a component of your own'))
    expect(page.getByRole('group', { name: '1 of 3' })).toHaveClass('active')
  })

  test("a nested carousel's slides don't take the enclosing slide's position", () => {
    const page = within(firstPaint('Carousel nested in a slide'))
    expect(page.getByRole('group', { name: '1 of 1' })).toHaveClass('active')
    // The inner carousel can't place a slide of your own component, so it positions none.
    expect(page.getByText('Inner one')).not.toHaveClass('active')
    expect(page.getByText('Inner one')).not.toHaveAttribute('aria-label')
  })

  test('a fade Carousel shows its first slide, fragments included', () => {
    const page = within(firstPaint('Carousel with fade'))
    const first = page.getByRole('group', { name: '1 of 2' })
    expect(first).toHaveClass('active')
    expect(first).toHaveTextContent('Slide 1')
  })

  test('a Menu open on its first render waits for its position, and never sets aria-hidden', () => {
    const list = within(firstPaint('Menu open')).getByRole('menu')
    expect(list).not.toHaveClass('show')
    expect(list).not.toHaveAttribute('aria-hidden')
  })

  test.for(['Calendar showing today', 'RangeCalendar showing today'])(
    '%s marks no day as today: the server does not know the time zone',
    (name) => {
      const page = within(firstPaint(name))
      expect(page.queryByRole('gridcell', { current: 'date' })).toBeNull()
      for (const cell of page.getAllByRole('gridcell')) {
        expect(cell).not.toHaveClass('datepicker-date-today')
      }
    }
  )

  // react-aria writes "Today, …" into the cell's label during render; until hydration the label is
  // react-aria's for a day that isn't today (`useCellToday`).
  test.for([
    'Calendar showing today',
    'RangeCalendar showing today',
    'DatePicker open on today',
    'DateRangePicker open on today'
  ])("%s calls no day today in its labels, and still labels today's cell as selected", (name) => {
    const page = within(firstPaint(name))
    const labels = page
      .getAllByRole('gridcell')
      .map((cell) => within(cell).getByRole('button').getAttribute('aria-label') ?? '')
    expect(labels.filter((label) => label.startsWith('Today'))).toEqual([])
    const date = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date())
    // A range's first and last day also carry its description, here one day's.
    const expected = name.includes('Range')
      ? `Selected Date: ${date}, ${date} selected`
      : `${date} selected`
    expect(labels).toContain(expected)
  })

  test('a field is described by its own help only', () => {
    const page = within(firstPaint('TextInput with help'))
    expect(page.getByRole('textbox', { name: 'Name' })).toHaveAccessibleDescription('Your name')
  })

  test('Table writes no empty aria-describedby', () => {
    const page = within(firstPaint('Table without descriptions'))
    expect(page.getByRole('grid')).not.toHaveAttribute('aria-describedby')
  })

  test('an empty DataGrid writes no empty aria-describedby and no negative size', () => {
    const page = within(firstPaint('DataGrid empty'))
    const grid = page.getByRole('grid')
    expect(grid).not.toHaveAttribute('aria-describedby')
    expect(grid.innerHTML).not.toMatch(/:\s*-\d/)
  })

  test('an empty ChipInput list is a group, which takes no aria-multiselectable', () => {
    const list = within(firstPaint('ChipInput empty')).getByRole('group', { name: 'Tags' })
    expect(list).not.toHaveAttribute('aria-multiselectable')
  })

  test('a masked OtpInput offers one-time codes, not saved passwords, in every box', () => {
    const boxes = within(firstPaint('OtpInput masked')).getAllByLabelText(/^Digit/)
    expect(boxes).toHaveLength(4)
    for (const box of boxes) {
      expect(box).toHaveAttribute('type', 'password')
      expect(box).toHaveAttribute('autocomplete', 'one-time-code')
    }
  })

  test('an open Popover trigger points at no panel until the portal exists', () => {
    const page = within(firstPaint('Popover open'))
    expect(page.getByRole('button', { name: 'More' })).not.toHaveAttribute('aria-controls')
  })

  test('an open Tooltip trigger is described by no tooltip until the portal exists', () => {
    const page = within(firstPaint('Tooltip open'))
    expect(page.getByRole('button', { name: 'Help' })).not.toHaveAttribute('aria-describedby')
  })

  // A server can't know what fits: it renders every item, and the toggle item hidden. Until the
  // page has hydrated the wrapper clips the row and lets it scroll.
  test('a NavOverflow renders every item, clipped, until its width is known', () => {
    const page = within(firstPaint('NavOverflow around a Nav'))
    expect(page.getByTestId('wrapper')).toHaveAttribute(
      'style',
      expect.stringContaining('overflow-x:auto')
    )
    expect(page.getAllByRole('link')).toHaveLength(3)
    const listItems = page.getAllByRole('listitem')
    expect(listItems).toHaveLength(4)
    for (const listItem of listItems) {
      expect(listItem).not.toHaveAttribute('data-cx-nav-overflow')
    }
    // The toggle item, the last one: there, hidden, with nothing in its menu.
    expect(listItems[3]).toHaveClass('nav-overflow-item', 'd-none')
    expect(page.getByRole('menu')).toBeEmptyDOMElement()
  })

  // Which section is being read depends on a scroll position the server doesn't have.
  test('a Scrollspy marks no section until the page has observed one', () => {
    const page = within(firstPaint('Scrollspy around a Nav'))
    expect(page.getByRole('link', { name: 'One' })).not.toHaveClass('active')
    expect(page.getByRole('link', { name: 'One' })).not.toHaveAttribute('aria-current')
    // An `active` given as a prop is the current page, as anywhere.
    expect(page.getByRole('link', { name: 'Two' })).toHaveAttribute('aria-current', 'page')
  })

  // react-aria chooses both by platform (iPhone, Android, iOS), which the server doesn't know.
  test("a NumberField renders a desktop's keyboard and no role description", () => {
    const input = within(firstPaint('NumberField with a label')).getByRole('textbox', {
      name: 'Quantity'
    })
    expect(input).toHaveValue('2')
    expect(input).toHaveAttribute('inputmode', 'numeric')
    expect(input).not.toHaveAttribute('aria-roledescription')
  })

  test('a NavOverflow around a TabList renders every tab, and its menu after hydration', () => {
    const page = within(firstPaint('NavOverflow around a TabList'))
    const tabs = page.getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent)).toEqual(['One', 'Two', 'More'])
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(page.getAllByRole('presentation')[2]).toHaveClass('nav-overflow-item', 'd-none')
    // The menu of a tab list is portaled, and a portal has no server equivalent.
    expect(page.queryByRole('menu')).not.toBeInTheDocument()
    expect(page.getByRole('tabpanel')).toHaveTextContent('Panel one')
  })
})

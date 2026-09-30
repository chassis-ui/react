import * as React from 'react'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { axe } from 'jest-axe'

import {
  type IconComponentProps,
  IconProvider,
  Menu,
  MenuItem,
  MenuList,
  MenuToggle,
  Nav,
  Navbar,
  NavbarNav,
  NavItem,
  NavLink,
  NavOverflow,
  Tab,
  TabList,
  TabPanel,
  Tabs
} from '../../../src/index'

// jsdom lays nothing out, so the widths `NavOverflow` reads are given here: every item is
// `ITEM_WIDTH` wide (or the width in `widths`, by its text), the toggle item `MORE_WIDTH`, and the
// wrapper `wrapperWidth`. An element that chassis-css hides has no width, as in a browser.
const ITEM_WIDTH = 100
const MORE_WIDTH = 80
let wrapperWidth = 1000
let widths: Record<string, number> = {}

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = []
  targets = new Set<Element>()

  constructor(public callback: ResizeObserverCallback) {
    ResizeObserverMock.instances.push(this)
  }

  observe(target: Element) {
    this.targets.add(target)
  }

  unobserve(target: Element) {
    this.targets.delete(target)
  }

  disconnect() {
    this.targets.clear()
  }
}

// The observers that watch an element matching `selector`, told that it resized.
function notifyResize(selector: string) {
  act(() => {
    ResizeObserverMock.instances.forEach((observer) => {
      const entries = [...observer.targets]
        .filter((target) => target.matches(selector))
        .map((target) => ({ target }) as ResizeObserverEntry)
      if (entries.length) observer.callback(entries, observer as unknown as ResizeObserver)
    })
  })
}

const nextFrame = () => act(() => new Promise((resolve) => requestAnimationFrame(resolve)))

// After a pass that moved something, the wrapper is observed again from the next frame (see
// `NavOverflow.tsx`), as it is by the time a browser delivers the next size.
async function resizeTo(width: number) {
  await nextFrame()
  wrapperWidth = width
  notifyResize('.nav-overflow')
}

// jsdom's own stylesheet gives a `<ul>` the padding chassis-css's `.nav` removes.
const style = document.createElement('style')
style.textContent = '.nav { padding-inline-start: 0 }'

beforeEach(() => {
  document.head.append(style)
  wrapperWidth = 1000
  widths = {}
  ResizeObserverMock.instances = []
  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
    this: HTMLElement
  ) {
    if (this.hasAttribute('data-cx-nav-overflow') || this.classList.contains('d-none')) return 0
    if (this.classList.contains('nav-overflow-item')) return MORE_WIDTH
    return widths[this.textContent ?? ''] ?? ITEM_WIDTH
  })
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(function (this: Element) {
    return this.classList.contains('nav-overflow') ? wrapperWidth : 0
  })
})

afterEach(() => {
  style.remove()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const LABELS = ['Home', 'Dashboard', 'Products', 'Services', 'Analytics', 'Reports', 'Settings']

// An icon component for `IconProvider`, so a test can find the icon and read its name.
const TestIcon = ({ name }: IconComponentProps) => <i data-testid="icon" data-name={name} />

const items = (active = 'Home') =>
  LABELS.map((label) => (
    <NavItem key={label} href={`#${label.toLowerCase()}`} active={label === active}>
      {label}
    </NavItem>
  ))

function renderNav(width: number, props: Partial<React.ComponentProps<typeof NavOverflow>> = {}) {
  wrapperWidth = width
  return render(
    <NavOverflow data-testid="wrapper" {...props}>
      <Nav>{items()}</Nav>
    </NavOverflow>
  )
}

const last = <T,>(values: T[]) => values[values.length - 1] as T
const wrapper = () => screen.getByTestId('wrapper')
const list = () => screen.getByRole('list')
const listItems = () => within(list()).getAllByRole('listitem')
// The toggle item is the last one, and its menu the last menu, after any an item holds.
const toggleItem = () => last(listItems())
const toggle = () => within(toggleItem()).getByRole('button')
const menu = () => last(screen.getAllByRole('menu'))
const item = (label: string) =>
  listItems().find((listItem) => listItem.textContent === label) as HTMLElement

// The labels of the items left in the list, and of those moved to the menu, in document order.
const shown = () =>
  listItems()
    .filter(
      (listItem) => listItem !== toggleItem() && !listItem.hasAttribute('data-cx-nav-overflow')
    )
    .map((listItem) => listItem.textContent)
const inMenu = () =>
  within(menu())
    .queryAllByRole('menuitem')
    .map((item) => item.textContent)

describe('NavOverflow', () => {
  describe('rendering', () => {
    test("renders chassis-css's wrapper around the list", () => {
      renderNav(1000, { className: 'custom' })
      expect(wrapper().tagName).toBe('DIV')
      expect(wrapper()).toHaveClass('nav-overflow', 'custom')
      expect(wrapper()).toContainElement(list())
      expect(list()).toHaveClass('nav')
    })

    test('renders the toggle item after the items, hidden while every item fits', () => {
      renderNav(1000)
      expect(listItems()).toHaveLength(LABELS.length + 1)
      expect(toggleItem()).toHaveClass('nav-item', 'nav-overflow-item', 'd-none')
      expect(toggle().tagName).toBe('BUTTON')
      expect(toggle()).toHaveAttribute('type', 'button')
      expect(toggle()).toHaveClass('nav-link', 'nav-overflow-toggle')
      expect(toggle()).not.toHaveClass('caret')
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
      expect(menu()).toHaveClass('menu', 'nav-overflow-menu')
      expect(toggleItem()).toContainElement(menu())
      expect(shown()).toEqual(LABELS)
      expect(inMenu()).toEqual([])
    })

    test('renders the icon before the text, and after it with iconPlacement="end"', () => {
      // The markup of chassis-css's plugin: the icon in its span, then the text in its own.
      const { rerender } = render(
        <IconProvider component={TestIcon}>
          <NavOverflow>
            <Nav>{items()}</Nav>
          </NavOverflow>
        </IconProvider>
      )
      expect(toggle().innerHTML).toMatch(
        /^<span class="nav-overflow-icon"[^>]*><i [^>]*><\/i><\/span><span class="nav-overflow-text">More<\/span>$/
      )

      rerender(
        <IconProvider component={TestIcon}>
          <NavOverflow iconPlacement="end" moreText="See all">
            <Nav>{items()}</Nav>
          </NavOverflow>
        </IconProvider>
      )
      expect(toggle().innerHTML).toMatch(
        /^<span class="nav-overflow-text">See all<\/span><span class="nav-overflow-icon"[^>]*><i [^>]*><\/i><\/span>$/
      )
    })

    test('names an icon-only toggle with moreLabel', () => {
      renderNav(350, { moreLabel: 'More pages', moreText: false })
      expect(toggle()).toHaveAccessibleName('More pages')
      expect(toggle()).toHaveTextContent('')
    })

    test('draws the icon IconProvider gives for `more`, or the one in moreIcon', () => {
      const tree = (props: React.ComponentProps<typeof IconProvider> & { moreIcon?: string }) => (
        <IconProvider component={TestIcon} icons={props.icons}>
          <NavOverflow moreIcon={props.moreIcon}>
            <Nav>{items()}</Nav>
          </NavOverflow>
        </IconProvider>
      )
      const icon = () => within(toggle()).getByTestId('icon')
      const { rerender } = render(tree({}))
      expect(icon()).toHaveAttribute('data-name', 'ellipsis-h-solid')

      rerender(tree({ icons: { more: 'dots' } }))
      expect(icon()).toHaveAttribute('data-name', 'dots')

      rerender(tree({ icons: { more: 'dots' }, moreIcon: 'grid' }))
      expect(icon()).toHaveAttribute('data-name', 'grid')

      rerender(
        <NavOverflow moreIcon={<i data-testid="own-icon" />}>
          <Nav>{items()}</Nav>
        </NavOverflow>
      )
      expect(toggle()).toContainElement(screen.getByTestId('own-icon'))
    })

    test('forwards a ref and other attributes to the wrapper', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <NavOverflow ref={ref} data-testid="wrapper" component="nav" aria-label="Main">
          <Nav>{items()}</Nav>
        </NavOverflow>
      )
      expect(screen.getByRole('navigation', { name: 'Main' })).toBe(ref.current)
      expect(ref.current).toBe(wrapper())
      expect(ref.current).toHaveClass('nav-overflow')
    })
  })

  describe('collapsing', () => {
    test('moves the items that do not fit into the menu, in their order', () => {
      renderNav(350)
      // The toggle (80) and the active item (100) are in the row whatever happens; one more fits.
      expect(shown()).toEqual(['Home', 'Dashboard'])
      expect(inMenu()).toEqual(['Products', 'Services', 'Analytics', 'Reports', 'Settings'])
      expect(toggleItem()).not.toHaveClass('d-none')
      // chassis-css hides a moved item by this attribute; it stays in the document.
      expect(item('Settings')).toHaveAttribute('data-cx-nav-overflow', 'true')
      expect(item('Settings')).toContainElement(screen.getByRole('link', { name: 'Settings' }))
    })

    test('renders a moved link as a menu item that keeps its props', () => {
      const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault())
      wrapperWidth = 250
      render(
        <NavOverflow>
          <Nav>
            <NavItem href="/" active>
              Home
            </NavItem>
            <NavItem href="/reports" id="reports" target="_blank" onClick={onClick}>
              Reports
            </NavItem>
            <NavItem href="/billing" disabled>
              Billing
            </NavItem>
          </Nav>
        </NavOverflow>
      )
      const reports = within(menu()).getByRole('menuitem', { name: 'Reports' })
      expect(reports.tagName).toBe('A')
      expect(reports).toHaveClass('menu-item')
      expect(reports).not.toHaveClass('nav-link')
      expect(reports).toHaveAttribute('href', '/reports')
      expect(reports).toHaveAttribute('target', '_blank')
      // The id stays with the link in the list: both are in the document.
      expect(reports).not.toHaveAttribute('id')
      expect(screen.getByRole('link', { name: 'Reports' })).toHaveAttribute('id', 'reports')
      fireEvent.click(reports)
      expect(onClick).toHaveBeenCalledTimes(1)

      const billing = within(menu()).getByRole('menuitem', { name: 'Billing' })
      expect(billing).toHaveClass('menu-item', 'disabled')
      expect(billing).toHaveAttribute('aria-disabled', 'true')
    })

    test('keeps the last item of a list that fits exactly', () => {
      renderNav(LABELS.length * ITEM_WIDTH)
      expect(shown()).toEqual(LABELS)
      expect(toggleItem()).toHaveClass('d-none')
    })

    test('follows the wrapper as it resizes', async () => {
      renderNav(1000)
      await resizeTo(650)
      expect(shown()).toEqual(['Home', 'Dashboard', 'Products', 'Services', 'Analytics'])
      expect(inMenu()).toEqual(['Reports', 'Settings'])

      await resizeTo(250)
      expect(shown()).toEqual(['Home'])

      await resizeTo(1000)
      expect(shown()).toEqual(LABELS)
      expect(inMenu()).toEqual([])
      expect(toggleItem()).toHaveClass('d-none')
    })

    test('measures again when an item changes its width', async () => {
      renderNav(700)
      expect(shown()).toEqual(LABELS)

      widths.Dashboard = 300
      // An item's own resize is handled a frame later (see `NavOverflow.tsx`).
      notifyResize('.nav-item')
      await nextFrame()
      expect(inMenu()).toEqual(['Analytics', 'Reports', 'Settings'])
    })

    // A ref that is a new function makes React detach and attach the wrapper's ref around the
    // list's effects, which is when the list measures.
    test('measures in the commit when the caller passes a new ref function each render', () => {
      const App = ({ label }: { label: string }) => (
        <NavOverflow ref={() => {}}>
          <Nav>
            <NavItem href="/" active>
              Home
            </NavItem>
            <NavItem href="/a">{label}</NavItem>
            <NavItem href="/b">B</NavItem>
          </Nav>
        </NavOverflow>
      )
      wrapperWidth = 300
      const { rerender } = render(<App label="A" />)
      expect(shown()).toEqual(['Home', 'A', 'B'])

      widths['A much longer label'] = 250
      rerender(<App label="A much longer label" />)
      expect(inMenu()).toEqual(['A much longer label', 'B'])
    })

    test('never moves the active item', () => {
      wrapperWidth = 350
      render(
        <NavOverflow>
          <Nav>{items('Reports')}</Nav>
        </NavOverflow>
      )
      expect(shown()).toEqual(['Home', 'Reports'])
      expect(inMenu()).toEqual(['Dashboard', 'Products', 'Services', 'Analytics', 'Settings'])
    })

    test('follows a link that becomes the current one by itself', async () => {
      // A router's link: it renders `aria-current` from state of its own, so neither the list nor
      // `NavOverflow` renders when it changes.
      let navigate: (path: string) => void = () => {}
      const RouterLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
        const [path, setPath] = React.useState('/home')
        navigate = setPath
        return (
          <NavItem asChild>
            <a href={to} aria-current={path === to ? 'page' : undefined}>
              {children}
            </a>
          </NavItem>
        )
      }
      wrapperWidth = 350
      render(
        <NavOverflow>
          <Nav>
            {LABELS.map((label) => (
              <RouterLink key={label} to={`/${label.toLowerCase()}`}>
                {label}
              </RouterLink>
            ))}
          </Nav>
        </NavOverflow>
      )
      expect(shown()).toEqual(['Home', 'Dashboard'])

      await act(async () => navigate('/settings'))
      expect(shown()).toEqual(['Home', 'Settings'])
      expect(inMenu()).not.toContain('Settings')
    })

    test('keeps an item marked keepVisible', () => {
      wrapperWidth = 350
      render(
        <NavOverflow>
          <Nav>
            {LABELS.map((label) => (
              <NavItem key={label} href="#" keepVisible={label === 'Settings'}>
                {label}
              </NavItem>
            ))}
          </Nav>
        </NavOverflow>
      )
      expect(item('Settings')).toHaveClass('nav-overflow-keep')
      expect(shown()).toEqual(['Home', 'Settings'])
    })

    test('keeps the item that has focus', async () => {
      renderNav(1000)
      act(() => screen.getByRole('link', { name: 'Analytics' }).focus())
      await resizeTo(350)
      expect(shown()).toEqual(['Home', 'Analytics'])
    })

    test('leaves at least `threshold` items in the list', () => {
      renderNav(150, { threshold: 3 })
      expect(shown()).toEqual(['Home', 'Dashboard', 'Products'])
    })

    test('measures again when threshold changes', () => {
      const { rerender } = renderNav(150)
      expect(shown()).toEqual(['Home'])
      // The same children: only the wrapper renders.
      const nav = <Nav>{items()}</Nav>
      rerender(<NavOverflow>{nav}</NavOverflow>)
      rerender(<NavOverflow threshold={2}>{nav}</NavOverflow>)
      expect(shown()).toEqual(['Home', 'Dashboard'])
    })

    test('moves every item below collapseBelow, given in pixels', async () => {
      renderNav(650, { collapseBelow: 700 })
      // All but the active one, which never moves.
      expect(shown()).toEqual(['Home'])
      await resizeTo(900)
      expect(shown()).toEqual(LABELS)
    })

    test("reads a breakpoint name from chassis-css's custom property, in rem", async () => {
      document.documentElement.style.setProperty('--cx-breakpoint-md', '48rem')
      document.documentElement.style.fontSize = '10px'
      try {
        renderNav(450, { collapseBelow: 'md' })
        expect(shown()).toEqual(['Home'])
        // 48rem is 480px here: wider than that, items collapse one by one again.
        await resizeTo(650)
        expect(shown()).toEqual(['Home', 'Dashboard', 'Products', 'Services', 'Analytics'])
      } finally {
        document.documentElement.removeAttribute('style')
      }
    })

    test('reports the counts through onOverflow when they change', async () => {
      const onOverflow = vi.fn()
      renderNav(1000, { onOverflow })
      expect(onOverflow).not.toHaveBeenCalled()

      await resizeTo(350)
      expect(onOverflow).toHaveBeenLastCalledWith({ overflowCount: 5, visibleCount: 2 })
      await resizeTo(1000)
      expect(onOverflow).toHaveBeenLastCalledWith({ overflowCount: 0, visibleCount: 7 })
      expect(onOverflow).toHaveBeenCalledTimes(2)
    })

    test('collapses items added later, and forgets removed ones', () => {
      wrapperWidth = 250
      const { rerender } = render(
        <NavOverflow>
          <Nav>{items().slice(0, 2)}</Nav>
        </NavOverflow>
      )
      expect(shown()).toEqual(['Home', 'Dashboard'])
      expect(toggleItem()).toHaveClass('d-none')

      rerender(
        <NavOverflow>
          <Nav>{items()}</Nav>
        </NavOverflow>
      )
      expect(shown()).toEqual(['Home'])
      expect(inMenu()).toHaveLength(6)

      rerender(
        <NavOverflow>
          <Nav>{items().slice(0, 3)}</Nav>
        </NavOverflow>
      )
      expect(inMenu()).toEqual(['Dashboard', 'Products'])
    })

    test("shows a moved link's latest props in the menu", () => {
      const Counter = () => {
        const [count, setCount] = React.useState(0)
        return (
          <NavItem href="#" onClick={() => setCount(count + 1)}>
            Inbox {count}
          </NavItem>
        )
      }
      wrapperWidth = 150
      render(
        <NavOverflow>
          <Nav>
            <NavItem href="#" active>
              Home
            </NavItem>
            <Counter />
          </Nav>
        </NavOverflow>
      )
      // Only the item renders: neither the list nor `NavOverflow` does.
      fireEvent.click(within(menu()).getByRole('menuitem', { name: 'Inbox 0' }))
      expect(within(menu()).getByRole('menuitem', { name: 'Inbox 1' })).toBeInTheDocument()
    })
  })

  describe('items', () => {
    test('collapses a NavItem that holds a NavLink', () => {
      wrapperWidth = 250
      render(
        <NavOverflow>
          <Nav>
            <NavItem>
              <NavLink href="/" active>
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/docs">Docs</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/blog">Blog</NavLink>
            </NavItem>
          </Nav>
        </NavOverflow>
      )
      expect(shown()).toEqual(['Home'])
      expect(within(menu()).getByRole('menuitem', { name: 'Blog' })).toHaveAttribute(
        'href',
        '/blog'
      )
    })

    test('renders a router link given with asChild as the menu item', () => {
      const RouterLink = React.forwardRef<
        HTMLAnchorElement,
        React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }
      >(({ to, ...props }, ref) => <a ref={ref} href={to} data-router="" {...props} />)
      RouterLink.displayName = 'RouterLink'

      wrapperWidth = 250
      render(
        <NavOverflow>
          <Nav>
            <NavItem href="/" active>
              Home
            </NavItem>
            <NavItem asChild>
              <RouterLink to="/docs">Docs</RouterLink>
            </NavItem>
            <NavItem>
              <NavLink asChild>
                <RouterLink to="/blog">Blog</RouterLink>
              </NavLink>
            </NavItem>
          </Nav>
        </NavOverflow>
      )
      for (const [name, href] of [
        ['Docs', '/docs'],
        ['Blog', '/blog']
      ] as const) {
        const item = within(menu()).getByRole('menuitem', { name })
        expect(item).toHaveAttribute('href', href)
        expect(item).toHaveAttribute('data-router')
        expect(item).toHaveClass('menu-item')
        expect(item).not.toHaveClass('nav-link')
      }
    })

    // The element is the caller's: its `ref` and `id` belong to the link in the list.
    test("leaves an asChild element's ref and id with the link in the list", async () => {
      const ref = React.createRef<HTMLAnchorElement>()
      wrapperWidth = 150
      render(
        <NavOverflow>
          <Nav>
            <NavItem href="/" active>
              Home
            </NavItem>
            <NavItem asChild>
              <a ref={ref} id="docs" href="/docs">
                Docs
              </a>
            </NavItem>
          </Nav>
        </NavOverflow>
      )
      const inList = screen.getByRole('link', { name: 'Docs' })
      expect(inMenu()).toEqual(['Docs'])
      expect(inList).toHaveAttribute('id', 'docs')
      expect(within(menu()).getByRole('menuitem', { name: 'Docs' })).not.toHaveAttribute('id')
      expect(ref.current).toBe(inList)

      await resizeTo(1000)
      expect(ref.current).toBe(inList)
    })

    // What a `Tooltip` around the link adds is for the link where it is.
    test('hands the menu item onClick, and none of the other handlers', () => {
      const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault())
      const onMouseEnter = vi.fn()
      wrapperWidth = 150
      render(
        <NavOverflow>
          <Nav>
            <NavItem href="/" active>
              Home
            </NavItem>
            <NavItem
              href="/docs"
              aria-describedby="tip"
              onClick={onClick}
              onMouseEnter={onMouseEnter}
            >
              Docs
            </NavItem>
          </Nav>
        </NavOverflow>
      )
      const item = within(menu()).getByRole('menuitem', { name: 'Docs' })
      expect(item).not.toHaveAttribute('aria-describedby')
      fireEvent.mouseEnter(item)
      fireEvent.click(item)
      expect(onMouseEnter).not.toHaveBeenCalled()
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('leaves an item without a link of its own in the list', () => {
      wrapperWidth = 250
      render(
        <NavOverflow>
          <Nav>
            <NavItem href="/" active>
              Home
            </NavItem>
            <NavItem href="/docs">Docs</NavItem>
            <NavItem>
              <Menu>
                <MenuToggle component={NavLink}>Account</MenuToggle>
                <MenuList>
                  <MenuItem href="/profile">Profile</MenuItem>
                </MenuList>
              </Menu>
            </NavItem>
            <Menu component="li" className="nav-item">
              <MenuToggle component={NavLink}>Help</MenuToggle>
              <MenuList>
                <MenuItem href="/faq">FAQ</MenuItem>
              </MenuList>
            </Menu>
          </Nav>
        </NavOverflow>
      )
      expect(shown()).toEqual(['Home', 'AccountProfile', 'HelpFAQ'])
      expect(inMenu()).toEqual(['Docs'])
    })

    test('collapses items rendered by a component or a fragment', () => {
      const Group = () => (
        <>
          <NavItem href="/a">A</NavItem>
          <NavItem href="/b">B</NavItem>
        </>
      )
      wrapperWidth = 250
      render(
        <NavOverflow>
          <Nav>
            <NavItem href="/" active>
              Home
            </NavItem>
            <Group />
            <>
              <NavItem href="/c">C</NavItem>
            </>
          </Nav>
        </NavOverflow>
      )
      expect(shown()).toEqual(['Home'])
      expect(inMenu()).toEqual(['A', 'B', 'C'])
    })

    test('collapses the items of a data-driven Nav', () => {
      wrapperWidth = 250
      render(
        <NavOverflow>
          <Nav
            items={[
              { label: 'Home', href: '/', active: true },
              { label: 'Docs', href: '/docs' },
              { label: 'Blog', href: '/blog' }
            ]}
          />
        </NavOverflow>
      )
      expect(shown()).toEqual(['Home'])
      expect(inMenu()).toEqual(['Docs', 'Blog'])
    })

    test('takes no part in a list nested inside an item', () => {
      wrapperWidth = 250
      render(
        <NavOverflow>
          <Nav aria-label="outer">
            <NavItem href="/" active>
              Home
            </NavItem>
            <NavItem>
              <Nav aria-label="inner">
                <NavItem href="/x">X</NavItem>
                <NavItem href="/y">Y</NavItem>
              </Nav>
            </NavItem>
          </Nav>
        </NavOverflow>
      )
      const inner = screen.getByRole('list', { name: 'inner' })
      const innerItems = within(inner).getAllByRole('listitem')
      expect(innerItems.map((listItem) => listItem.textContent)).toEqual(['X', 'Y'])
      for (const listItem of innerItems) {
        expect(listItem).not.toHaveAttribute('data-cx-nav-overflow')
      }
      // The nested links are no item's link: nothing reaches the menu.
      expect(screen.queryAllByRole('menuitem')).toHaveLength(0)
    })

    test('renders a Nav outside a NavOverflow as before', () => {
      render(<Nav>{items()}</Nav>)
      expect(listItems().map((listItem) => listItem.textContent)).toEqual(LABELS)
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  describe('menu', () => {
    test('opens from the toggle and closes when the last item leaves it', async () => {
      renderNav(350)
      fireEvent.click(toggle())
      expect(toggle()).toHaveAttribute('aria-expanded', 'true')
      expect(toggleItem()).toHaveClass('show')
      expect(menu()).toHaveClass('show')
      expect(menu()).toHaveAttribute('data-cx-placement', 'bottom-end')

      await resizeTo(1000)
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
      expect(toggleItem()).toHaveClass('d-none')
      // It doesn't come back open.
      await resizeTo(350)
      expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    })

    test('moves focus to the last item when the toggle goes while it has focus', async () => {
      renderNav(350)
      act(() => toggle().focus())
      await resizeTo(1000)
      expect(toggleItem()).toHaveClass('d-none')
      expect(screen.getByRole('link', { name: 'Settings' })).toHaveFocus()
    })

    test('moves focus to the toggle when the focused menu item goes back to the list', async () => {
      renderNav(350)
      fireEvent.click(toggle())
      act(() => within(menu()).getByRole('menuitem', { name: 'Products' }).focus())
      await resizeTo(450)
      expect(inMenu()).not.toContain('Products')
      expect(toggle()).toHaveFocus()
    })

    test('leaves focus alone when it is elsewhere', async () => {
      renderNav(350)
      act(() => screen.getByRole('link', { name: 'Home' }).focus())
      await resizeTo(1000)
      expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus()
    })

    test('renders the menu in menuContainer', () => {
      renderNav(350, { menuContainer: true, menuPlacement: 'bottom-start' })
      expect(wrapper()).not.toContainElement(menu())
      expect(inMenu()).toHaveLength(5)
      fireEvent.click(toggle())
      expect(menu()).toHaveAttribute('data-cx-placement', 'bottom-start')
    })
  })

  describe('NavbarNav', () => {
    test('collapses inside a Navbar, as a .nav', () => {
      wrapperWidth = 250
      render(
        <Navbar expand aria-label="Main">
          <NavOverflow>
            <NavbarNav>
              <NavItem>
                <NavLink href="/" active>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/docs">Docs</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/blog">Blog</NavLink>
              </NavItem>
            </NavbarNav>
          </NavOverflow>
        </Navbar>
      )
      expect(list()).toHaveClass('nav', 'navbar-nav')
      expect(shown()).toEqual(['Home'])
      expect(inMenu()).toEqual(['Docs', 'Blog'])
    })

    test('is not a .nav outside a NavOverflow', () => {
      render(
        <NavbarNav>
          <NavItem href="/">Home</NavItem>
        </NavbarNav>
      )
      expect(list()).not.toHaveClass('nav')
      expect(listItems()).toHaveLength(1)
    })
  })

  describe('TabList', () => {
    const onSelectionChange = vi.fn()

    function renderTabs(width: number, props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
      wrapperWidth = width
      return render(
        <Tabs defaultSelectedKey="Home" onSelectionChange={onSelectionChange} {...props}>
          <NavOverflow data-testid="wrapper">
            <TabList aria-label="Sections">
              {LABELS.map((label) => (
                <Tab key={label} id={label} disabled={label === 'Dashboard'}>
                  {label}
                </Tab>
              ))}
            </TabList>
          </NavOverflow>
          {LABELS.map((label) => (
            <TabPanel key={label} id={label}>
              {label} panel
            </TabPanel>
          ))}
        </Tabs>
      )
    }

    const tablist = () => screen.getByRole('tablist')
    const tab = (name: string) => within(tablist()).getByRole('tab', { name })
    // A tab's `<li>`, and the toggle's: `presentation`, so that the list owns tabs only.
    const tabItems = () => within(tablist()).getAllByRole('presentation')
    const shownTabs = () =>
      tabItems()
        .filter((tabItem) => !tabItem.hasAttribute('data-cx-nav-overflow'))
        .map((tabItem) => tabItem.textContent)

    beforeEach(() => onSelectionChange.mockClear())

    test('renders the wrapper in place of the list, and the panels after it', () => {
      renderTabs(1000)
      expect(wrapper()).toHaveClass('nav-overflow')
      expect(wrapper()).toContainElement(tablist())
      expect(within(tablist()).getAllByRole('tab')).toHaveLength(LABELS.length + 1)
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Home panel')
      expect(wrapper()).not.toContainElement(screen.getByRole('tabpanel'))
    })

    test('moves the tabs that do not fit, and renders the toggle as one more tab', () => {
      renderTabs(450)
      expect(shownTabs()).toEqual(['Home', 'Dashboard', 'Products', 'More'])
      const more = tab('More')
      expect(more).toHaveClass('nav-link', 'nav-overflow-toggle')
      expect(more).toHaveAttribute('aria-selected', 'false')
      expect(more).toHaveAttribute('aria-haspopup')
      expect(more).toHaveAttribute('tabindex', '-1')
      expect(last(tabItems())).toContainElement(more)
      // A `tablist` owns tabs only: the menu is rendered outside it.
      expect(wrapper()).not.toContainElement(menu())
      expect(inMenu()).toEqual(['Services', 'Analytics', 'Reports', 'Settings'])
    })

    test('renders the menu outside the list even with menuContainer={false}', () => {
      wrapperWidth = 450
      render(
        <Tabs defaultSelectedKey="Home">
          <NavOverflow menuContainer={false}>
            <TabList aria-label="Sections">
              {LABELS.map((label) => (
                <Tab key={label} id={label}>
                  {label}
                </Tab>
              ))}
            </TabList>
          </NavOverflow>
        </Tabs>
      )
      expect(tablist()).not.toContainElement(menu())
    })

    test('never moves the selected tab, or a tab marked keepVisible', () => {
      wrapperWidth = 450
      render(
        <Tabs selectedKey="Reports">
          <NavOverflow>
            <TabList aria-label="Sections">
              {LABELS.map((label) => (
                <Tab key={label} id={label} keepVisible={label === 'Settings'}>
                  {label}
                </Tab>
              ))}
            </TabList>
          </NavOverflow>
        </Tabs>
      )
      expect(shownTabs()).toEqual(['Home', 'Reports', 'Settings', 'More'])
    })

    test('selects a tab chosen in the menu, shows it in the list and focuses it', () => {
      renderTabs(450)
      fireEvent.click(tab('More'))
      fireEvent.click(within(menu()).getByRole('menuitem', { name: 'Settings' }))

      expect(onSelectionChange).toHaveBeenCalledWith('Settings')
      expect(tab('Settings')).toHaveAttribute('aria-selected', 'true')
      expect(shownTabs()).toEqual(['Home', 'Dashboard', 'Settings', 'More'])
      expect(tab('Settings')).toHaveFocus()
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Settings panel')
    })

    test('does not take focus later for a tab a controlled Tabs did not select', async () => {
      renderTabs(450, { selectedKey: 'Home' })
      fireEvent.click(tab('More'))
      fireEvent.click(within(menu()).getByRole('menuitem', { name: 'Settings' }))
      expect(onSelectionChange).toHaveBeenCalledWith('Settings')
      act(() => tab('Home').focus())
      await resizeTo(1000)
      expect(shownTabs()).toContain('Settings')
      expect(tab('Home')).toHaveFocus()
    })

    test('shows a disabled tab as a disabled menu item', () => {
      wrapperWidth = 450
      render(
        <Tabs defaultSelectedKey="Home">
          <NavOverflow>
            <TabList aria-label="Sections">
              <Tab id="Home">Home</Tab>
              <Tab id="One">One</Tab>
              <Tab id="Two">Two</Tab>
              <Tab id="Three">Three</Tab>
              <Tab id="Four" disabled>
                Four
              </Tab>
            </TabList>
          </NavOverflow>
        </Tabs>
      )
      expect(within(menu()).getByRole('menuitem', { name: 'Four' })).toBeDisabled()
    })

    test('moves with the arrow keys among the shown tabs and the toggle', () => {
      renderTabs(450)
      act(() => tab('Home').focus())

      // Dashboard is disabled, and skipped.
      fireEvent.keyDown(tab('Home'), { key: 'ArrowRight' })
      expect(tab('Products')).toHaveFocus()
      expect(tab('Products')).toHaveAttribute('aria-selected', 'true')

      // The toggle takes focus, and selects nothing.
      fireEvent.keyDown(tab('Products'), { key: 'ArrowRight' })
      expect(tab('More')).toHaveFocus()
      expect(tab('Products')).toHaveAttribute('aria-selected', 'true')

      fireEvent.keyDown(tab('More'), { key: 'ArrowRight' })
      expect(tab('Home')).toHaveFocus()
      fireEvent.keyDown(tab('Home'), { key: 'ArrowLeft' })
      expect(tab('More')).toHaveFocus()
      fireEvent.keyDown(tab('More'), { key: 'Home' })
      expect(tab('Home')).toHaveFocus()
      fireEvent.keyDown(tab('Home'), { key: 'End' })
      expect(tab('More')).toHaveFocus()
      // Never a hidden tab.
      expect(onSelectionChange).not.toHaveBeenCalledWith('Settings')
    })

    test('moves focus without selecting under keyboardActivation="manual"', () => {
      renderTabs(450, { keyboardActivation: 'manual' })
      act(() => tab('Home').focus())
      fireEvent.keyDown(tab('Home'), { key: 'ArrowRight' })
      expect(tab('Products')).toHaveFocus()
      expect(tab('Home')).toHaveAttribute('aria-selected', 'true')
    })

    // react-aria gives the Tab stop to the tab focused last, which needn't be the selected one.
    test('never hides the tab that is the Tab stop', async () => {
      renderTabs(1000, { keyboardActivation: 'manual' })
      act(() => tab('Home').focus())
      fireEvent.keyDown(tab('Home'), { key: 'End' })
      expect(tab('Settings')).toHaveFocus()
      act(() => tab('Settings').blur())

      await resizeTo(450)
      expect(tab('Home')).toHaveAttribute('aria-selected', 'true')
      expect(shownTabs()).toContain('Settings')
      const stops = within(tablist())
        .getAllByRole('tab')
        .filter((stop) => stop.getAttribute('tabindex') === '0')
      expect(stops).toEqual([tab('Settings')])
      expect(shownTabs()).toEqual(['Home', 'Dashboard', 'Settings', 'More'])
    })

    test('makes the toggle the only stop while it has focus', () => {
      renderTabs(450)
      act(() => tab('Home').focus())
      expect(tab('Home')).toHaveAttribute('tabindex', '0')

      fireEvent.keyDown(tab('Home'), { key: 'End' })
      expect(tab('More')).toHaveFocus()
      for (const stop of within(tablist()).getAllByRole('tab')) {
        expect(stop).toHaveAttribute('tabindex', '-1')
      }

      fireEvent.keyDown(tab('More'), { key: 'Home' })
      expect(tab('Home')).toHaveAttribute('tabindex', '0')
    })

    test('leaves other keys, and a vertical list, to react-aria', () => {
      renderTabs(450, { orientation: 'vertical' })
      act(() => tab('Home').focus())
      fireEvent.keyDown(tab('Home'), { key: 'ArrowDown' })
      expect(tab('Products')).toHaveFocus()
    })

    // react-aria's tab list gives focus to its selected tab when focus enters it from outside.
    test('leaves focus on the toggle when it takes it from outside the list', async () => {
      renderTabs(450)
      const more = tab('More')
      await act(async () => more.focus())
      expect(more).toHaveFocus()
    })

    test('renders the list of a Tabs without a NavOverflow as before', () => {
      render(
        <Tabs defaultSelectedKey="a">
          <TabList aria-label="Sections">
            <Tab id="a">A</Tab>
            <Tab id="b">B</Tab>
          </TabList>
          <TabPanel id="a">Panel A</TabPanel>
          <TabPanel id="b">Panel B</TabPanel>
        </Tabs>
      )
      expect(within(tablist()).getAllByRole('tab')).toHaveLength(2)
      act(() => tab('A').focus())
      fireEvent.keyDown(tab('A'), { key: 'ArrowRight' })
      expect(tab('B')).toHaveFocus()
    })
  })

  describe('misuse', () => {
    test('warns when there is no list to collapse', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <NavOverflow>
          <p>Nothing</p>
        </NavOverflow>
      )
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('found no `.nav`'))
    })

    // The toggle item is an `<li>`: a list of bare links has no items, and gets no toggle.
    test('warns for a Nav that is not a list, and adds nothing to it', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      wrapperWidth = 100
      render(
        <NavOverflow>
          <Nav component="nav" aria-label="Main">
            <NavLink href="/" active>
              Home
            </NavLink>
            <NavLink href="/docs">Docs</NavLink>
          </Nav>
        </NavOverflow>
      )
      const nav = screen.getByRole('navigation', { name: 'Main' })
      expect(within(nav).getAllByRole('link')).toHaveLength(2)
      expect(within(nav).queryByRole('listitem')).not.toBeInTheDocument()
      expect(within(nav).queryByRole('button')).not.toBeInTheDocument()
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('a <nav> has none'))
    })

    test('leaves a list of plain markup alone', () => {
      wrapperWidth = 100
      render(
        <NavOverflow>
          <ul className="nav">
            <li className="nav-item">One</li>
            <li className="nav-item">Two</li>
          </ul>
        </NavOverflow>
      )
      expect(listItems()).toHaveLength(2)
      for (const listItem of listItems()) {
        expect(listItem).not.toHaveAttribute('data-cx-nav-overflow')
      }
    })
  })

  describe('cleanup', () => {
    test('stops observing when it unmounts', () => {
      const { unmount } = renderNav(350)
      const observer = ResizeObserverMock.instances.find((instance) =>
        [...instance.targets].some((target) => target.matches('.nav-overflow'))
      ) as ResizeObserverMock
      expect(observer.targets.size).toBe(LABELS.length + 2)
      unmount()
      expect(observer.targets.size).toBe(0)
    })

    // StrictMode runs every effect's cleanup once after mounting: the observers and what the
    // items registered are dropped, and have to come back.
    test('collapses and follows resizes under StrictMode', async () => {
      wrapperWidth = 350
      render(
        <React.StrictMode>
          <NavOverflow>
            <Nav>{items()}</Nav>
          </NavOverflow>
        </React.StrictMode>
      )
      expect(shown()).toEqual(['Home', 'Dashboard'])
      expect(inMenu()).toHaveLength(5)
      await resizeTo(650)
      expect(inMenu()).toEqual(['Reports', 'Settings'])
    })

    test('leaves no observer behind when the wrapper becomes another element', async () => {
      const App = ({ as }: { as: 'div' | 'nav' }) => (
        <NavOverflow component={as} data-testid="wrapper">
          <Nav>{items()}</Nav>
        </NavOverflow>
      )
      wrapperWidth = 250
      const { rerender, unmount } = render(<App as="div" />)
      const old = wrapper()
      const first = ResizeObserverMock.instances.find((instance) => instance.targets.has(old))
      rerender(<App as="nav" />)
      expect(shown()).toEqual(['Home'])

      // A browser tells the old observer that the element it watched is gone.
      act(() => {
        first?.callback(
          [{ target: old } as unknown as ResizeObserverEntry],
          first as unknown as ResizeObserver
        )
      })
      await nextFrame()
      await nextFrame()
      unmount()
      for (const observer of ResizeObserverMock.instances) {
        expect([...observer.targets].filter((target) => target.matches('.nav-overflow'))).toEqual(
          []
        )
      }
    })

    test('works where there is no ResizeObserver', () => {
      vi.stubGlobal('ResizeObserver', undefined)
      renderNav(350)
      expect(shown()).toEqual(['Home', 'Dashboard'])
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with its menu open', async () => {
      const { container } = render(
        <nav aria-label="Main">
          <NavOverflow>
            <Nav>{items()}</Nav>
          </NavOverflow>
        </nav>
      )
      await resizeTo(350)
      fireEvent.click(toggle())
      expect(menu()).toHaveClass('show')
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations as a tab list with its menu open', async () => {
      wrapperWidth = 450
      render(
        <Tabs defaultSelectedKey="Home">
          <NavOverflow>
            <TabList aria-label="Sections">
              {LABELS.map((label) => (
                <Tab key={label} id={label}>
                  {label}
                </Tab>
              ))}
            </TabList>
          </NavOverflow>
          {LABELS.map((label) => (
            <TabPanel key={label} id={label}>
              {label} panel
            </TabPanel>
          ))}
        </Tabs>
      )
      fireEvent.click(screen.getByRole('tab', { name: 'More' }))
      expect(menu()).toHaveClass('show')
      // The menu is in `document.body`, outside any landmark: axe's `region` rule is about the
      // page around the component.
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
    })
  })
})

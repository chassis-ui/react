import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import {
  Button,
  Checkbox,
  Menu,
  MenuToggle,
  MenuList,
  MenuItem,
  MenuSubmenu,
  Modal,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Popover
} from '../../../src/index'
import { actUserEvent } from '../../actUserEvent'

describe('Menu', () => {
  describe('rendering', () => {
    test('renders as a custom component with className merged', () => {
      render(
        <Menu className="bazinga" component="h3" placement="right-end" visible={true}>
          Test
        </Menu>
      )
      expect(screen.getByText('Test')).toHaveClass('bazinga')
    })

    test('exposes the toggle class and aria wiring, the item class/role, and the panel placement/aria, when open', () => {
      render(
        <Menu visible>
          <MenuToggle>Test</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
            <MenuItem>B</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Test' })
      expect(toggle).toHaveClass('button', 'primary', 'caret', 'show')
      expect(toggle).toHaveAttribute('aria-haspopup', 'true')
      expect(toggle).toHaveAttribute('data-react-aria-pressable', 'true')
      expect(toggle).toHaveAttribute('tabindex', '0')
      expect(toggle).toHaveAttribute('type', 'button')

      const item = screen.getByRole('menuitem', { name: 'A' })
      expect(item).toHaveClass('menu-item')

      const menu = screen.getByRole('menu')
      expect(menu).toHaveAttribute('data-cx-placement', 'bottom-start')
      expect(menu).not.toHaveAttribute('aria-hidden')
      expect(menu.getAttribute('aria-labelledby')).toBe(toggle.getAttribute('id'))
      expect(toggle.getAttribute('aria-controls')).toBe(menu.getAttribute('id'))
    })
  })

  describe('open/close behavior', () => {
    test('reflects the visible prop on the menu panel', () => {
      render(
        <Menu visible={false}>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
    })

    test('click toggles the menu and closes on outside click', () => {
      vi.useFakeTimers()
      render(
        <Menu>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
            <MenuItem>B</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByText('Toggle')
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')

      fireEvent.click(toggle)
      expect(screen.getByRole('menu')).toHaveClass('show')
      expect(toggle).toHaveAttribute('aria-expanded', 'true')

      vi.runAllTimers()
      fireEvent.click(document)
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
      vi.useRealTimers()
    })

    test('Escape closes a menu opened via click, even though focus stays on the toggle', () => {
      render(
        <Menu>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByText('Toggle')

      fireEvent.click(toggle)
      expect(screen.getByRole('menu')).toHaveClass('show')
      // react-aria's mouse-press open path leaves focus on the trigger, not the panel.
      expect(document.activeElement).toBe(toggle)

      fireEvent.keyDown(window, { key: 'Escape' })
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
    })

    // Escape returns focus to the toggle because it closes the menu. Controlled, it only asks.
    test('Escape on a controlled menu moves focus to the toggle only when the menu closes', () => {
      function Fixture({ follow }: { follow: boolean }) {
        const [visible, setVisible] = React.useState(true)
        return (
          <>
            <input aria-label="Search" />
            <Menu visible={visible} onVisibleChange={follow ? setVisible : () => {}}>
              <MenuToggle>Toggle</MenuToggle>
              <MenuList>
                <MenuItem>A</MenuItem>
              </MenuList>
            </Menu>
          </>
        )
      }

      const { unmount } = render(<Fixture follow={false} />)
      const search = screen.getByRole('textbox', { name: 'Search' })
      search.focus()
      fireEvent.keyDown(window, { key: 'Escape' })
      expect(screen.getByRole('button', { name: 'Toggle' })).toHaveAttribute(
        'aria-expanded',
        'true'
      )
      expect(search).toHaveFocus()
      unmount()

      render(<Fixture follow />)
      screen.getByRole('textbox', { name: 'Search' }).focus()
      fireEvent.keyDown(window, { key: 'Escape' })
      const toggle = screen.getByRole('button', { name: 'Toggle' })
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      expect(toggle).toHaveFocus()
    })

    test('clicking the toggle again while open closes the menu', async () => {
      const user = userEvent.setup()
      render(
        <Menu>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByText('Toggle')

      // react-aria's `useMenuTrigger` opens on pointerdown, so a full `userEvent.click` press
      // sequence updates `Menu`/`MenuToggle` state outside `user.click`'s own act-environment
      // tracking — `actUserEvent` wraps it in `act(...)` with `waitFor`'s act-environment override
      // neutralized, so the update is actually captured instead of just silencing the warning.
      // See `actUserEvent.ts` for why the override is needed on top of a plain `act()`.
      await actUserEvent(() => user.click(toggle))
      expect(toggle).toHaveAttribute('aria-expanded', 'true')

      await actUserEvent(() => user.click(toggle))
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })

    // Regression test: the toggle stopped its click, so an open menu never heard it and stayed
    // open beside the one the click opened.
    test("a click on another menu's toggle closes this one", () => {
      vi.useFakeTimers()
      render(
        <>
          <Menu>
            <MenuToggle>First</MenuToggle>
            <MenuList>
              <MenuItem>A</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuToggle>Second</MenuToggle>
            <MenuList>
              <MenuItem>B</MenuItem>
            </MenuList>
          </Menu>
        </>
      )
      const first = screen.getByRole('button', { name: 'First' })
      const second = screen.getByRole('button', { name: 'Second' })
      fireEvent.click(first)
      act(() => vi.runAllTimers())
      expect(first).toHaveAttribute('aria-expanded', 'true')

      fireEvent.click(second)
      act(() => vi.runAllTimers())
      expect(first).toHaveAttribute('aria-expanded', 'false')
      expect(second).toHaveAttribute('aria-expanded', 'true')
      vi.useRealTimers()
    })

    // Regression test: an item chosen closed the menu without returning focus, which stayed on
    // the item in a list that is `display: none` once closed, so it fell to `<body>`.
    test('choosing an item closes the menu and returns focus to the toggle', () => {
      vi.useFakeTimers()
      render(
        <Menu>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Toggle' })
      fireEvent.click(toggle)
      act(() => vi.runAllTimers())
      const item = screen.getByRole('menuitem', { name: 'A' })
      item.focus()
      fireEvent.click(item)
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      expect(toggle).toHaveFocus()
      vi.useRealTimers()
    })

    // Focus returned by script matches `:focus-visible` in the browser whatever the interaction
    // was, so a mouse choice could leave a keyboard ring on the toggle.
    test.each([
      ['the mouse', 1, 'none'],
      ['the keyboard', 0, '']
    ])(
      'an item chosen with %s (click detail %i) returns focus to the toggle with outline "%s"',
      (_, detail, outline) => {
        vi.useFakeTimers()
        render(
          <Menu>
            <MenuToggle>Toggle</MenuToggle>
            <MenuList>
              <MenuItem>A</MenuItem>
            </MenuList>
          </Menu>
        )
        const toggle = screen.getByRole('button', { name: 'Toggle' })
        fireEvent.click(toggle)
        act(() => vi.runAllTimers())
        const item = screen.getByRole('menuitem', { name: 'A' })
        item.focus()
        fireEvent.click(item, { detail })
        expect(toggle).toHaveFocus()
        expect(toggle.style.outline).toBe(outline)

        // A key press is the keyboard in use again: the ring comes back.
        fireEvent.keyDown(toggle, { key: 'Shift' })
        expect(toggle.style.outline).toBe('')
        vi.useRealTimers()
      }
    )

    test('an item that moves focus elsewhere keeps it there', () => {
      vi.useFakeTimers()
      render(
        <>
          <input aria-label="Name" />
          <Menu>
            <MenuToggle>Toggle</MenuToggle>
            <MenuList>
              <MenuItem onClick={() => screen.getByRole('textbox', { name: 'Name' }).focus()}>
                Rename
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      )
      const toggle = screen.getByRole('button', { name: 'Toggle' })
      fireEvent.click(toggle)
      act(() => vi.runAllTimers())
      fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }))
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus()
      vi.useRealTimers()
    })

    // A click on a `<label>` lands on it (or its text) before the browser passes it on to the
    // control, and the tag-name test closed the menu on it: the docs' "Remember me" did.
    test("a click on a form control's label in the list keeps the menu open", async () => {
      const user = userEvent.setup()
      render(
        <Menu>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <Checkbox id="remember" label="Remember me" />
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Toggle' })
      await user.click(toggle)
      await user.click(screen.getByText('Remember me'))
      expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeChecked()
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
    })

    // Only a form inside the list is used in place.
    test('a menu inside a form still closes on an item', () => {
      vi.useFakeTimers()
      render(
        <form aria-label="Settings">
          <Menu>
            <MenuToggle>Toggle</MenuToggle>
            <MenuList>
              <MenuItem>A</MenuItem>
            </MenuList>
          </Menu>
        </form>
      )
      const toggle = screen.getByRole('button', { name: 'Toggle' })
      fireEvent.click(toggle)
      act(() => vi.runAllTimers())
      fireEvent.click(screen.getByRole('menuitem', { name: 'A' }))
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      vi.useRealTimers()
    })

    // react-aria's `usePress` stops the click of the element it is on, which never reached the
    // menu's listener on `window`: the menu stayed open beside the control just used.
    test('a click on a react-aria pressable outside closes the menu', async () => {
      const user = userEvent.setup()
      render(
        <>
          <Menu>
            <MenuToggle>Toggle</MenuToggle>
            <MenuList>
              <MenuItem>A</MenuItem>
            </MenuList>
          </Menu>
          <Tabs>
            <TabList aria-label="Tabs">
              <Tab id="one">One</Tab>
              <Tab id="two">Two</Tab>
            </TabList>
            <TabPanel id="one">1</TabPanel>
            <TabPanel id="two">2</TabPanel>
          </Tabs>
          <Checkbox label="Agree" />
        </>
      )
      const toggle = screen.getByRole('button', { name: 'Toggle' })
      await user.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      await user.click(screen.getByRole('tab', { name: 'Two' }))
      expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
      expect(toggle).toHaveAttribute('aria-expanded', 'false')

      await user.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      await user.click(screen.getByText('Agree'))
      expect(screen.getByRole('checkbox', { name: 'Agree' })).toBeChecked()
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })

    test('autoClose="inside" only closes on clicks inside the menu', () => {
      vi.useFakeTimers()
      render(
        <Menu autoClose="inside">
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      fireEvent.click(screen.getByText('Toggle'))
      vi.runAllTimers()

      fireEvent.click(document.body)
      expect(screen.getByRole('menu')).toHaveClass('show')

      fireEvent.click(screen.getByText('A'))
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
      vi.useRealTimers()
    })

    test('autoClose={false} never closes automatically', () => {
      vi.useFakeTimers()
      render(
        <Menu autoClose={false}>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      fireEvent.click(screen.getByText('Toggle'))
      vi.runAllTimers()
      fireEvent.click(document.body)
      expect(screen.getByRole('menu')).toHaveClass('show')
      vi.useRealTimers()
    })

    // Regression test: a `MenuSubmenu` panel portals straight to `document.body`, structurally
    // detached from the top-level menu's own DOM subtree — without `registerOverlay` (see
    // `MenuContext`), a click on a submenu item would be misclassified as "outside" the menu,
    // breaking both `autoClose` modes below in opposite ways.
    test('autoClose="inside" closes the menu when a submenu item is clicked, despite the submenu panel being portaled outside the menu\'s own DOM subtree', () => {
      vi.useFakeTimers()
      render(
        <Menu autoClose="inside">
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuSubmenu trigger="File">
              <MenuItem>New</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </Menu>
      )
      fireEvent.click(screen.getByText('Toggle'))
      vi.runAllTimers()
      const topMenu = screen.getByRole('menu', { name: 'Toggle' })

      fireEvent.click(screen.getByText('File'))
      fireEvent.click(screen.getByText('New'))

      expect(topMenu).not.toHaveClass('show')
      vi.useRealTimers()
    })

    test('autoClose="outside" leaves the menu open when a submenu item is clicked', () => {
      vi.useFakeTimers()
      render(
        <Menu autoClose="outside">
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuSubmenu trigger="File">
              <MenuItem>New</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </Menu>
      )
      fireEvent.click(screen.getByText('Toggle'))
      vi.runAllTimers()

      fireEvent.click(screen.getByText('File'))
      fireEvent.click(screen.getByText('New'))

      expect(screen.getByRole('menu', { name: 'Toggle' })).toHaveClass('show')
      vi.useRealTimers()
    })

    test('puts a rendered wrapper component into the show class while open', () => {
      render(
        <Menu component="li" className="nav-item" data-testid="wrapper">
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const wrapper = screen.getByTestId('wrapper')
      expect(wrapper).not.toHaveClass('show')

      fireEvent.click(screen.getByText('Toggle'))
      expect(wrapper).toHaveClass('show')
    })
  })

  // Regression tests: `Menu` listened for Escape on `window` by itself, as `Popover` did, and a
  // non-modal dialog for any keydown inside it, so one press closed the menu and what it was in.
  describe('Escape among other overlays', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })
    afterEach(() => {
      vi.useRealTimers()
    })

    const settle = () => {
      act(() => vi.runAllTimers())
    }
    const fixture = (
      <Menu>
        <MenuToggle>Toggle</MenuToggle>
        <MenuList>
          <MenuItem>A</MenuItem>
        </MenuList>
      </Menu>
    )

    test('closes a menu in a popover, and leaves the popover to the next press', () => {
      render(
        <Popover content={fixture} title="popover title">
          <Button>Open</Button>
        </Popover>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Open' }))
      settle()
      fireEvent.click(screen.getByRole('button', { name: 'Toggle' }))
      settle()
      expect(screen.getByRole('menu')).toHaveClass('show')

      fireEvent.keyDown(window, { key: 'Escape' })
      settle()
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
      expect(screen.getByText('popover title')).toBeInTheDocument()

      fireEvent.keyDown(window, { key: 'Escape' })
      settle()
      expect(screen.queryByText('popover title')).not.toBeInTheDocument()
    })

    test('closes a menu in a non-modal Modal and leaves the modal open, wherever focus is', () => {
      const onClose = vi.fn()
      render(
        <Modal instant modal={false} onClose={onClose} visible>
          {fixture}
        </Modal>
      )
      const toggle = screen.getByRole('button', { name: 'Toggle' })

      // Opened by a click, focus stays on the toggle: the key reaches the stack on `window`.
      fireEvent.click(toggle)
      fireEvent.keyDown(toggle, { key: 'Escape' })
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
      expect(onClose).not.toHaveBeenCalled()

      // With focus on an item, the list handles the key itself.
      fireEvent.click(toggle)
      fireEvent.keyDown(screen.getByRole('menuitem', { name: 'A' }), { key: 'Escape' })
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
      expect(onClose).not.toHaveBeenCalled()

      fireEvent.keyDown(toggle, { key: 'Escape' })
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  // Regression test: inside was the list's and the submenus' DOM subtrees only, so a click in an
  // overlay opened from an item, which is portaled out of the list, was a click outside.
  describe('overlays opened from the list', () => {
    test('a click inside a popover opened from an item is neither on an item nor outside', () => {
      vi.useFakeTimers()
      const press = (target: Element) => {
        fireEvent.pointerDown(target)
        fireEvent.click(target)
      }
      render(
        <Menu autoClose="outside">
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <Popover content="details">
              <MenuItem>Info</MenuItem>
            </Popover>
          </MenuList>
        </Menu>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Toggle' }))
      act(() => vi.runAllTimers())
      press(screen.getByRole('menuitem', { name: 'Info' }))
      act(() => vi.runAllTimers())
      const details = screen.getByText('details')
      expect(screen.getByRole('menu', { hidden: true })).not.toContainElement(details)

      press(details)
      act(() => vi.runAllTimers())
      expect(screen.getByRole('menu', { hidden: true })).toHaveClass('show')
      expect(details).toBeInTheDocument()

      press(document.body)
      act(() => vi.runAllTimers())
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
      vi.useRealTimers()
    })
  })

  describe('in a dialog', () => {
    const fixture = (
      <Menu>
        <MenuToggle>Toggle</MenuToggle>
        <MenuList>
          <MenuItem>A</MenuItem>
        </MenuList>
      </Menu>
    )

    // Regression test: unlike `Popover`, `Tooltip` and `ContextMenu`, a menu left open when its
    // dialog closed was still open when the dialog opened again.
    test('closes when the dialog it is in closes', () => {
      const onVisibleChange = vi.fn()
      const { rerender } = render(
        <Modal instant visible>
          {React.cloneElement(fixture, { onVisibleChange })}
        </Modal>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Toggle' }))
      expect(screen.getByRole('menu')).toHaveClass('show')
      onVisibleChange.mockClear()

      rerender(
        <Modal instant visible={false}>
          {React.cloneElement(fixture, { onVisibleChange })}
        </Modal>
      )
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
      expect(onVisibleChange).toHaveBeenCalledExactlyOnceWith(false)
    })
  })

  describe('keyboard navigation', () => {
    // jsdom never runs real layout — offsetWidth/offsetHeight/getClientRects() are always zero,
    // but menuNavigation's `isVisible` filter depends on non-zero dimensions to tell a hidden
    // item from a shown one. Stub a non-zero offsetHeight so these assertions exercise the real
    // focus call instead of silently seeing an always-empty items list (see MenuSubmenu.spec.tsx).
    beforeEach(() => {
      vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(1)
    })
    afterEach(() => {
      vi.restoreAllMocks()
    })

    test('ArrowDown/ArrowUp move focus between items and wrap at the ends', () => {
      render(
        <Menu visible>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem href="#">A</MenuItem>
            <MenuItem href="#">B</MenuItem>
            <MenuItem href="#">C</MenuItem>
          </MenuList>
        </Menu>
      )
      const menu = screen.getByRole('menu')
      const [a, b, c] = [screen.getByText('A'), screen.getByText('B'), screen.getByText('C')]

      fireEvent.keyDown(menu, { key: 'ArrowDown' })
      expect(a).toHaveFocus()

      fireEvent.keyDown(a!, { key: 'ArrowDown' })
      expect(b).toHaveFocus()

      fireEvent.keyDown(b!, { key: 'ArrowUp' })
      expect(a).toHaveFocus()

      fireEvent.keyDown(a!, { key: 'ArrowUp' })
      expect(c).toHaveFocus()

      fireEvent.keyDown(c!, { key: 'ArrowDown' })
      expect(a).toHaveFocus()
    })

    test('ArrowUp from no current focus lands on the last item', () => {
      render(
        <Menu visible>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem href="#">A</MenuItem>
            <MenuItem href="#">B</MenuItem>
          </MenuList>
        </Menu>
      )
      fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowUp' })
      expect(screen.getByText('B')).toHaveFocus()
    })

    test('Home/End jump focus to the first/last item', () => {
      render(
        <Menu visible>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem href="#">A</MenuItem>
            <MenuItem href="#">B</MenuItem>
            <MenuItem href="#">C</MenuItem>
          </MenuList>
        </Menu>
      )
      const menu = screen.getByRole('menu')

      fireEvent.keyDown(menu, { key: 'End' })
      expect(screen.getByText('C')).toHaveFocus()

      fireEvent.keyDown(menu, { key: 'Home' })
      expect(screen.getByText('A')).toHaveFocus()
    })

    test('ArrowDown/Home/End on an empty menu is a no-op', () => {
      render(
        <Menu visible>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList></MenuList>
        </Menu>
      )
      const menu = screen.getByRole('menu')
      expect(() => {
        fireEvent.keyDown(menu, { key: 'ArrowDown' })
        fireEvent.keyDown(menu, { key: 'Home' })
        fireEvent.keyDown(menu, { key: 'End' })
      }).not.toThrow()
    })
  })

  describe('show/hide callbacks', () => {
    // Regression test: `onShown`/`onHidden` must wait for the `.menu` panel's CSS transition
    // (see `_menu.scss`) to finish, matching `Modal`'s identically-worded contract — they used
    // to fire synchronously alongside `onShow`/`onHide`, before any fade actually completed.
    test('onShow/onHide fire immediately; onShown/onHidden wait for the transition to finish', () => {
      vi.useFakeTimers()
      const onShow = vi.fn()
      const onShown = vi.fn()
      const onHide = vi.fn()
      const onHidden = vi.fn()
      render(
        <Menu onShow={onShow} onShown={onShown} onHide={onHide} onHidden={onHidden}>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      // Regression test: all four report transitions, so mounting closed fires none of them.
      // This used to fire `onHide` (and schedule `onHidden`) on the initial commit, reporting a
      // close for a menu that had never opened.
      expect(onHide).not.toHaveBeenCalled()
      expect(onShow).not.toHaveBeenCalled()
      vi.runAllTimers()
      expect(onHidden).not.toHaveBeenCalled()
      expect(onShown).not.toHaveBeenCalled()

      fireEvent.click(screen.getByText('Toggle'))
      expect(onShow).toHaveBeenCalledTimes(1)
      expect(onShown).not.toHaveBeenCalled()

      vi.runAllTimers()
      expect(onShown).toHaveBeenCalledTimes(1)

      fireEvent.click(document.body)
      expect(onHide).toHaveBeenCalledTimes(1)
      expect(onHidden).not.toHaveBeenCalled()

      vi.runAllTimers()
      expect(onHidden).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    // StrictMode runs the mount effect twice and keeps refs, so a `mounted` flag let the second
    // run report the initial state as a change.
    test.each([false, true])(
      'fires none of them on mount under StrictMode (defaultVisible: %s)',
      (defaultVisible) => {
        const onShow = vi.fn()
        const onShown = vi.fn()
        const onHide = vi.fn()
        const onHidden = vi.fn()
        render(
          <React.StrictMode>
            <Menu
              defaultVisible={defaultVisible}
              onHidden={onHidden}
              onHide={onHide}
              onShow={onShow}
              onShown={onShown}
            >
              <MenuToggle>Toggle</MenuToggle>
              <MenuList>
                <MenuItem>A</MenuItem>
              </MenuList>
            </Menu>
          </React.StrictMode>
        )
        for (const callback of [onShow, onShown, onHide, onHidden]) {
          expect(callback).not.toHaveBeenCalled()
        }

        if (defaultVisible) fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
        else fireEvent.click(screen.getByText('Toggle'))
        expect(defaultVisible ? onHide : onShow).toHaveBeenCalledTimes(1)
      }
    )
  })

  describe('accessibility', () => {
    test('has no axe violations when open', async () => {
      const { container } = render(
        <Menu visible>
          <MenuToggle>Test</MenuToggle>
          <MenuList>
            <MenuItem href="#">A</MenuItem>
            <MenuItem href="#">B</MenuItem>
          </MenuList>
        </Menu>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

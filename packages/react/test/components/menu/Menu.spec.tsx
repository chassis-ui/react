import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Menu, MenuToggle, MenuList, MenuItem, MenuSubmenu } from '../../../src/index'
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
      expect(menu).toHaveAttribute('aria-hidden', 'false')
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
      // Captured while still open — once closed the panel gets `aria-hidden="true"`, and an
      // aria-hidden element's accessible name computes as empty, so `getByRole(..., { name })`
      // can no longer find it by name at that point (only by role, via `hidden: true`).
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
      // Mounting while already closed fires the same `onHide` (and schedules `onHidden`) once,
      // as a pre-existing side effect of the callback effect running on mount regardless of
      // dependency changes — unrelated to what's under test here, so start counts fresh.
      onShow.mockClear()
      onShown.mockClear()
      onHide.mockClear()
      onHidden.mockClear()

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

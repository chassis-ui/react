import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Menu, MenuToggle, MenuList, MenuItem, NavLink } from '../../../src/index'
import { actUserEvent } from '../../actUserEvent'

describe('MenuToggle', () => {
  describe('rendering', () => {
    test('renders a button with the caret class and aria-expanded', () => {
      render(
        <Menu>
          <MenuToggle>Test</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Test' })
      expect(toggle).toHaveClass('button', 'caret')
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })

    test('forwards custom props to the underlying button', () => {
      render(
        <Menu>
          <MenuToggle color="secondary" className="bazinga">
            Test
          </MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Test' })
      expect(toggle).toHaveClass('secondary', 'bazinga')
    })

    // Issue #38: the prop was typed as `ContextStyle`, which has no `link`.
    test('takes every `Button` variant, `link` included', () => {
      render(
        <Menu>
          <MenuToggle color="default" variant="link">
            Account
          </MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      expect(screen.getByRole('button', { name: 'Account' })).toHaveClass('button', 'link', 'caret')
    })

    test('gets the show class while its menu is open, for a pressed look', () => {
      render(
        <Menu>
          <MenuToggle>Test</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Test' })
      expect(toggle).not.toHaveClass('show')

      fireEvent.click(toggle)
      expect(toggle).toHaveClass('show')
    })

    test('leaves the caret out with caret={false}', () => {
      render(
        <Menu>
          <MenuToggle caret={false} aria-label="More">
            …
          </MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'More' })
      expect(toggle).toHaveClass('button')
      expect(toggle).not.toHaveClass('caret')
    })

    // react-aria writes a `tabIndex` of its own, which used to replace the caller's.
    test("keeps the caller's tabIndex", () => {
      render(
        <Menu>
          <MenuToggle tabIndex={-1}>Test</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      expect(screen.getByRole('button', { name: 'Test' })).toHaveAttribute('tabindex', '-1')
    })

    test('renders as a NavLink when component is overridden', () => {
      render(
        <Menu>
          <MenuToggle component={NavLink} className="nav-link">
            Test
          </MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Test' })
      expect(toggle.tagName).toBe('A')
      expect(toggle).toHaveClass('nav-link', 'caret')
      expect(toggle).not.toHaveClass('button')
    })
  })

  describe('href', () => {
    // `Button` renders an `<a>` for `href`, so react-aria gives it the button role a link trigger
    // needs, and no `type`, which an `<a>` doesn't take.
    test('renders a link trigger with the button role', () => {
      render(
        <Menu>
          <MenuToggle href="/files">Files</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Files' })
      expect(toggle.tagName).toBe('A')
      expect(toggle).toHaveAttribute('href', '/files')
      expect(toggle).not.toHaveAttribute('type')
    })

    test('keeps a native button given as component free of a redundant role', () => {
      render(
        <Menu>
          <MenuToggle component="button">Files</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Files' })
      expect(toggle).not.toHaveAttribute('role')
      expect(toggle).toHaveAttribute('type', 'button')
    })
  })

  // `disabled` reached only the rendered element, and react-aria's trigger opened on a press
  // or a key all the same: an `<a>` delivers both.
  describe('disabled', () => {
    const DisabledMenu = (props: { component?: typeof NavLink; href?: string }) => (
      <Menu>
        <MenuToggle disabled {...props}>
          Account
        </MenuToggle>
        <MenuList>
          <MenuItem>A</MenuItem>
        </MenuList>
      </Menu>
    )

    test.each([
      ['a NavLink', { component: NavLink, href: '#' }],
      ['a Button with href', { href: '#' }]
    ])('%s never opens its menu on a click or a key', async (_, props) => {
      const user = userEvent.setup()
      render(<DisabledMenu {...props} />)
      const toggle = screen.getByText('Account')
      expect(toggle).toHaveAttribute('aria-disabled', 'true')
      await user.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      for (const key of ['ArrowDown', 'ArrowUp', 'Enter', ' ']) {
        fireEvent.keyDown(toggle, { key })
        expect(toggle).toHaveAttribute('aria-expanded', 'false')
      }
    })

    test('a disabled button never opens its menu on a pointerdown', () => {
      render(<DisabledMenu />)
      const toggle = screen.getByRole('button', { name: 'Account' })
      expect(toggle).toBeDisabled()
      fireEvent.pointerDown(toggle, { pointerType: 'mouse', button: 0 })
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('click behavior', () => {
    // react-aria focuses the toggle by script while the press starts, and a browser then matches
    // `:focus-visible` on it, which is what the global listeners act on. jsdom doesn't.
    const matchFocusVisible = (el: HTMLElement) =>
      vi
        .spyOn(el, 'matches')
        .mockImplementation(
          (selector) =>
            selector === ':focus-visible' || HTMLElement.prototype.matches.call(el, selector)
        )

    test('suppresses the focus ring on a real pointer click, restoring it on blur', async () => {
      const user = userEvent.setup()
      render(
        <Menu>
          <MenuToggle>Test</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Test' })
      matchFocusVisible(toggle)
      // See `actUserEvent.ts` for why this needs it instead of a plain `act(...)` wrapper.
      await actUserEvent(() => user.click(toggle))
      expect(toggle).toHaveFocus()
      expect(toggle.style.outline).toBe('none')
      toggle.blur()
      expect(toggle.style.outline).toBe('')
    })

    test('leaves the focus ring alone for a keyboard-activated click', () => {
      render(
        <Menu>
          <MenuToggle>Test</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Test' })
      toggle.focus()
      act(() => {
        toggle.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, detail: 0 })
        )
      })
      expect(toggle.style.outline).toBe('')
    })

    test('still restores the focus ring on blur after re-clicking without an intervening blur', async () => {
      const user = userEvent.setup()
      render(
        <Menu>
          <MenuToggle>Test</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Test' })
      matchFocusVisible(toggle)
      // Opens, then re-clicking while still focused closes it again — the exact re-click-while-
      // focused case `wasOpenRef` handles, and the one that used to stack a second blur listener.
      await actUserEvent(() => user.click(toggle))
      await actUserEvent(() => user.click(toggle))
      expect(toggle.style.outline).toBe('none')
      toggle.blur()
      expect(toggle.style.outline).toBe('')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying button', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <Menu>
          <MenuToggle ref={ref}>Test</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(ref.current).toBe(screen.getByRole('button'))
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Menu>
          <MenuToggle>Test</MenuToggle>
          <MenuList>
            <MenuItem href="#">A</MenuItem>
          </MenuList>
        </Menu>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

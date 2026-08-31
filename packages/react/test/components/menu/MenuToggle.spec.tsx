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

  describe('click behavior', () => {
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

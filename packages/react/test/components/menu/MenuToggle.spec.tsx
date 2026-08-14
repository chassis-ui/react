import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Menu, MenuToggle, MenuList, MenuItem, NavLink } from '../../../src/index'

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

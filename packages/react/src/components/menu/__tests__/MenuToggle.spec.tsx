import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Menu } from '../../../index'

describe('Menu.Toggle', () => {
  describe('rendering', () => {
    test('renders a button with the caret class and aria-expanded', () => {
      render(
        <Menu>
          <Menu.Toggle>Test</Menu.Toggle>
          <Menu.List>
            <Menu.Item>A</Menu.Item>
          </Menu.List>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Test' })
      expect(toggle).toHaveClass('button', 'caret')
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })

    test('forwards custom props to the underlying button', () => {
      render(
        <Menu>
          <Menu.Toggle color="secondary" className="bazinga">
            Test
          </Menu.Toggle>
          <Menu.List>
            <Menu.Item>A</Menu.Item>
          </Menu.List>
        </Menu>
      )
      const toggle = screen.getByRole('button', { name: 'Test' })
      expect(toggle).toHaveClass('secondary', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying button', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <Menu>
          <Menu.Toggle ref={ref}>Test</Menu.Toggle>
          <Menu.List>
            <Menu.Item>A</Menu.Item>
          </Menu.List>
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
          <Menu.Toggle>Test</Menu.Toggle>
          <Menu.List>
            <Menu.Item href="#">A</Menu.Item>
          </Menu.List>
        </Menu>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

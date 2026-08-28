import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ListItem } from '../../../src/index'

describe('ListItem', () => {
  describe('rendering', () => {
    test('renders an li with the base class by default', () => {
      render(<ListItem>Test</ListItem>)
      const item = screen.getByText('Test')
      expect(item).toHaveClass('list-item')
      expect(item.tagName).toBe('LI')
    })

    test('applies color, active and disabled classes together', () => {
      render(
        <ListItem className="bazinga" active={true} color="warning" disabled={true}>
          Test
        </ListItem>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'list-item',
        'context',
        'warning',
        'active',
        'disabled',
        'bazinga'
      )
    })

    test('renders as an interactive link when component is "a"', () => {
      render(
        <ListItem component="a" href="/bazinga">
          Test
        </ListItem>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('list-action')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('renders as an interactive button when component is "button"', () => {
      render(<ListItem component="button">Test</ListItem>)
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toHaveClass('list-action')
    })

    test('exposes aria-current and aria-disabled when active/disabled', () => {
      render(
        <ListItem component="a" href="/bazinga" active disabled>
          Test
        </ListItem>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveAttribute('aria-current', 'page')
      expect(link).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref for the default li element', () => {
      const ref = React.createRef<HTMLLIElement>()
      render(<ListItem ref={ref}>Test</ListItem>)
      expect(ref.current).toBeInstanceOf(HTMLLIElement)
    })

    test('forwards a ref to the underlying anchor when component is "a"', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <ListItem ref={ref} component="a" href="/bazinga">
          Test
        </ListItem>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    test('forwards a ref to the underlying button when component is "button"', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <ListItem ref={ref} component="button">
          Test
        </ListItem>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations as a plain list item', async () => {
      const { container } = render(
        <ul>
          <ListItem>Test</ListItem>
        </ul>
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations as an active link', async () => {
      const { container } = render(
        <ListItem component="a" href="/bazinga" active>
          Test
        </ListItem>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { PaginationItem } from '../../../src/index'

describe('PaginationItem', () => {
  describe('rendering', () => {
    test('renders a li wrapping a button by default', () => {
      render(<PaginationItem>Test</PaginationItem>)
      const item = screen.getByRole('listitem')
      expect(item).toHaveClass('pagination-item')
      expect(item.tagName).toBe('LI')
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toHaveClass('pagination-link')
      expect(button).toHaveAttribute('type', 'button')
    })

    test('renders an anchor when href is provided', () => {
      render(<PaginationItem href="/bazinga">Test</PaginationItem>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('pagination-link')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('renders as a span and ignores href when active', () => {
      render(
        <PaginationItem active href="/bazinga">
          Test
        </PaginationItem>
      )
      const item = screen.getByRole('listitem')
      expect(item).toHaveClass('pagination-item', 'active')
      expect(item).toHaveAttribute('aria-current', 'page')
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      const span = screen.getByText('Test')
      expect(span.tagName).toBe('SPAN')
      expect(span).toHaveClass('pagination-link')
    })

    test('renders a disabled button when disabled with no href', () => {
      render(<PaginationItem disabled>Test</PaginationItem>)
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toBeDisabled()
      expect(screen.getByRole('listitem')).toHaveClass('disabled')
    })

    test('renders as a custom component with only className and ref applied', () => {
      render(
        <PaginationItem className="bazinga" component="h3">
          Test
        </PaginationItem>
      )
      expect(screen.getByRole('listitem')).toHaveClass('pagination-item', 'bazinga')
      const heading = screen.getByText('Test')
      expect(heading.tagName).toBe('H3')
      expect(heading).toHaveClass('pagination-link')
    })
  })

  describe('click behavior', () => {
    test('fires onClick on the default button', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<PaginationItem onClick={onClick}>Test</PaginationItem>)
      await user.click(screen.getByRole('button', { name: 'Test' }))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('blocks onClick when disabled', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <PaginationItem disabled onClick={onClick}>
          Test
        </PaginationItem>
      )
      await user.click(screen.getByRole('button', { name: 'Test' }))
      expect(onClick).not.toHaveBeenCalled()
    })

    test('blocks navigation and onClick when a disabled anchor is clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <PaginationItem disabled href="/bazinga" onClick={onClick}>
          Test
        </PaginationItem>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveAttribute('aria-disabled', 'true')
      await user.click(link)
      expect(onClick).not.toHaveBeenCalled()
    })

    test('a custom component with onClick gets button keyboard semantics', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <PaginationItem component="div" onClick={onClick}>
          Test
        </PaginationItem>
      )
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button.tagName).toBe('DIV')
      expect(button).toHaveAttribute('tabIndex', '0')

      button.focus()
      await user.keyboard('{Enter}')
      expect(onClick).toHaveBeenCalledTimes(1)

      await user.keyboard(' ')
      expect(onClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying button by default', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<PaginationItem ref={ref}>Test</PaginationItem>)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    test('forwards a ref to the underlying anchor when href is provided', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <PaginationItem ref={ref} href="/bazinga">
          Test
        </PaginationItem>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ul>
          <PaginationItem href="/bazinga">A</PaginationItem>
          <PaginationItem active>B</PaginationItem>
        </ul>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

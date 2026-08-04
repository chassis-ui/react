import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Pagination } from '../../../index'

describe('Pagination.Item', () => {
  describe('rendering', () => {
    test('renders a li wrapping a button by default', () => {
      render(<Pagination.Item>Test</Pagination.Item>)
      const item = screen.getByRole('listitem')
      expect(item).toHaveClass('page-item')
      expect(item.tagName).toBe('LI')
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toHaveClass('page-link')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Pagination.Item>Test</Pagination.Item>)
      expect(container).toMatchSnapshot()
    })

    test('renders an anchor when href is provided', () => {
      render(<Pagination.Item href="/bazinga">Test</Pagination.Item>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('page-link')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('renders as a span and ignores href when active', () => {
      render(
        <Pagination.Item active href="/bazinga">
          Test
        </Pagination.Item>
      )
      const item = screen.getByRole('listitem')
      expect(item).toHaveClass('page-item', 'active')
      expect(item).toHaveAttribute('aria-current', 'page')
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      const span = screen.getByText('Test')
      expect(span.tagName).toBe('SPAN')
      expect(span).toHaveClass('page-link')
    })

    test('renders a disabled button when disabled with no href', () => {
      render(<Pagination.Item disabled>Test</Pagination.Item>)
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toBeDisabled()
      expect(screen.getByRole('listitem')).toHaveClass('disabled')
    })

    test('renders as a custom component with only className and ref applied', () => {
      render(
        <Pagination.Item className="bazinga" component="h3">
          Test
        </Pagination.Item>
      )
      expect(screen.getByRole('listitem')).toHaveClass('page-item', 'bazinga')
      const heading = screen.getByText('Test')
      expect(heading.tagName).toBe('H3')
      expect(heading).toHaveClass('page-link')
    })
  })

  describe('click behavior', () => {
    test('fires onClick on the default button', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<Pagination.Item onClick={onClick}>Test</Pagination.Item>)
      await user.click(screen.getByRole('button', { name: 'Test' }))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('blocks onClick when disabled', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Pagination.Item disabled onClick={onClick}>
          Test
        </Pagination.Item>
      )
      await user.click(screen.getByRole('button', { name: 'Test' }))
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying button by default', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<Pagination.Item ref={ref}>Test</Pagination.Item>)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    test('forwards a ref to the underlying anchor when href is provided', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <Pagination.Item ref={ref} href="/bazinga">
          Test
        </Pagination.Item>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ul>
          <Pagination.Item href="/bazinga">A</Pagination.Item>
          <Pagination.Item active>B</Pagination.Item>
        </ul>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

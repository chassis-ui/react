import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CxPaginationItem } from '../../../index'

describe('CxPaginationItem', () => {
  describe('rendering', () => {
    test('renders a li wrapping a button by default', () => {
      const { container } = render(<CxPaginationItem>Test</CxPaginationItem>)
      expect(container.firstChild).toHaveClass('page-item')
      expect(container.firstChild?.nodeName).toBe('LI')
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toHaveClass('page-link')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxPaginationItem>Test</CxPaginationItem>)
      expect(container).toMatchSnapshot()
    })

    test('renders an anchor when href is provided', () => {
      render(<CxPaginationItem href="/bazinga">Test</CxPaginationItem>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('page-link')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('renders as a span and ignores href when active', () => {
      const { container } = render(
        <CxPaginationItem active href="/bazinga">
          Test
        </CxPaginationItem>
      )
      expect(container.firstChild).toHaveClass('page-item', 'active')
      expect(container.firstChild).toHaveAttribute('aria-current', 'page')
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      const span = screen.getByText('Test')
      expect(span.tagName).toBe('SPAN')
      expect(span).toHaveClass('page-link')
    })

    test('renders a disabled button when disabled with no href', () => {
      render(<CxPaginationItem disabled>Test</CxPaginationItem>)
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toBeDisabled()
      expect(button.closest('li')).toHaveClass('disabled')
    })

    test('renders as a custom component with only className and ref applied', () => {
      const { container } = render(
        <CxPaginationItem className="bazinga" component="h3">
          Test
        </CxPaginationItem>
      )
      expect(container.firstChild).toHaveClass('page-item', 'bazinga')
      const heading = screen.getByText('Test')
      expect(heading.tagName).toBe('H3')
      expect(heading).toHaveClass('page-link')
    })
  })

  describe('click behavior', () => {
    test('fires onClick on the default button', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<CxPaginationItem onClick={onClick}>Test</CxPaginationItem>)
      await user.click(screen.getByRole('button', { name: 'Test' }))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('blocks onClick when disabled', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <CxPaginationItem disabled onClick={onClick}>
          Test
        </CxPaginationItem>
      )
      await user.click(screen.getByRole('button', { name: 'Test' }))
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying button by default', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<CxPaginationItem ref={ref}>Test</CxPaginationItem>)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    test('forwards a ref to the underlying anchor when href is provided', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <CxPaginationItem ref={ref} href="/bazinga">
          Test
        </CxPaginationItem>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ul>
          <CxPaginationItem href="/bazinga">A</CxPaginationItem>
          <CxPaginationItem active>B</CxPaginationItem>
        </ul>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CxPagination, CxPaginationItem } from '../../../index'

describe('CxPagination', () => {
  describe('rendering', () => {
    test('renders a nav wrapping a ul with the base class', () => {
      render(
        <CxPagination>
          <CxPaginationItem>A</CxPaginationItem>
        </CxPagination>
      )
      const nav = screen.getByRole('navigation')
      expect(nav.querySelector('ul')).toHaveClass('pagination')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxPagination>
          <CxPaginationItem>A</CxPaginationItem>
          <CxPaginationItem>B</CxPaginationItem>
          <CxPaginationItem>C</CxPaginationItem>
        </CxPagination>
      )
      expect(container).toMatchSnapshot()
    })

    test('applies alignment, size and className to the inner ul', () => {
      render(
        <CxPagination className="bazinga" align="end" size="large">
          Test
        </CxPagination>
      )
      const nav = screen.getByRole('navigation')
      expect(nav.querySelector('ul')).toHaveClass(
        'bazinga',
        'pagination',
        'pagination-large',
        'justify-content-end'
      )
    })
  })

  describe('smart pagination', () => {
    test('renders Prev/Next and a page for each number up to maxVisiblePages', () => {
      render(<CxPagination activePage={2} pages={3} onActivePageChange={vi.fn()} />)

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      // The active page renders as a non-interactive span, not a button — see CxPaginationItem.
      const active = screen.getByText('2')
      expect(active.closest('li')).toHaveAttribute('aria-current', 'page')
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    })

    test('collapses flanking pages into leading and trailing ellipses beyond maxVisiblePages', () => {
      render(
        <CxPagination activePage={5} pages={10} maxVisiblePages={5} onActivePageChange={vi.fn()} />
      )
      expect(screen.getAllByText('…')).toHaveLength(2)
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()
    })

    test('disables Previous on the first page and Next on the last page', () => {
      const { rerender } = render(
        <CxPagination activePage={1} pages={3} onActivePageChange={vi.fn()} />
      )
      expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()

      rerender(<CxPagination activePage={3} pages={3} onActivePageChange={vi.fn()} />)
      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    })

    test('fires onActivePageChange when a page number is clicked', async () => {
      const user = userEvent.setup()
      const onActivePageChange = vi.fn()
      render(<CxPagination activePage={1} pages={3} onActivePageChange={onActivePageChange} />)

      await user.click(screen.getByRole('button', { name: '2' }))
      expect(onActivePageChange).toHaveBeenCalledWith(2)
    })

    test('fires onActivePageChange when Next is clicked', async () => {
      const user = userEvent.setup()
      const onActivePageChange = vi.fn()
      render(<CxPagination activePage={1} pages={3} onActivePageChange={onActivePageChange} />)

      await user.click(screen.getByRole('button', { name: 'Next' }))
      expect(onActivePageChange).toHaveBeenCalledWith(2)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying nav element', () => {
      const ref = React.createRef<HTMLElement>()
      render(
        <CxPagination ref={ref}>
          <CxPaginationItem>A</CxPaginationItem>
        </CxPagination>
      )
      expect(ref.current).toBeInstanceOf(HTMLElement)
      expect(ref.current?.tagName).toBe('NAV')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxPagination activePage={2} pages={3} onActivePageChange={vi.fn()} />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

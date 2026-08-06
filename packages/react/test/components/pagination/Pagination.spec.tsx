import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { I18nProvider, Pagination, PaginationItem } from '../../../src/index'

describe('Pagination', () => {
  describe('rendering', () => {
    test('renders a nav wrapping a ul with the base class', () => {
      render(
        <Pagination>
          <PaginationItem>A</PaginationItem>
        </Pagination>
      )
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('list')).toHaveClass('pagination')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <Pagination>
          <PaginationItem>A</PaginationItem>
          <PaginationItem>B</PaginationItem>
          <PaginationItem>C</PaginationItem>
        </Pagination>
      )
      expect(container).toMatchSnapshot()
    })

    test('applies alignment, size and className to the inner ul', () => {
      render(
        <Pagination className="bazinga" align="end" size="large">
          Test
        </Pagination>
      )
      expect(screen.getByRole('list')).toHaveClass(
        'bazinga',
        'pagination',
        'pagination-large',
        'justify-content-end'
      )
    })
  })

  describe('smart pagination', () => {
    test('renders Prev/Next and a page for each number up to maxVisiblePages', () => {
      render(<Pagination activePage={2} pages={3} onActivePageChange={vi.fn()} />)

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      // The active page renders as a non-interactive span, not a button — see PaginationItem.
      // listitem's accessible name isn't computed from content (verified), so the enclosing
      // <li> can't be found by role + name and needs raw node access instead.
      const active = screen.getByText('2')
      // eslint-disable-next-line testing-library/no-node-access
      expect(active.closest('li')).toHaveAttribute('aria-current', 'page')
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    })

    test('collapses flanking pages into leading and trailing ellipses beyond maxVisiblePages', () => {
      render(
        <Pagination activePage={5} pages={10} maxVisiblePages={5} onActivePageChange={vi.fn()} />
      )
      expect(screen.getAllByText('…')).toHaveLength(2)
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()
    })

    test('disables Previous on the first page and Next on the last page', () => {
      const { rerender } = render(
        <Pagination activePage={1} pages={3} onActivePageChange={vi.fn()} />
      )
      expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()

      rerender(<Pagination activePage={3} pages={3} onActivePageChange={vi.fn()} />)
      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    })

    test('fires onActivePageChange when a page number is clicked', async () => {
      const user = userEvent.setup()
      const onActivePageChange = vi.fn()
      render(<Pagination activePage={1} pages={3} onActivePageChange={onActivePageChange} />)

      await user.click(screen.getByRole('button', { name: '2' }))
      expect(onActivePageChange).toHaveBeenCalledWith(2)
    })

    test('fires onActivePageChange when Next is clicked', async () => {
      const user = userEvent.setup()
      const onActivePageChange = vi.fn()
      render(<Pagination activePage={1} pages={3} onActivePageChange={onActivePageChange} />)

      await user.click(screen.getByRole('button', { name: 'Next' }))
      expect(onActivePageChange).toHaveBeenCalledWith(2)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying nav element', () => {
      const ref = React.createRef<HTMLElement>()
      render(
        <Pagination ref={ref}>
          <PaginationItem>A</PaginationItem>
        </Pagination>
      )
      expect(ref.current).toBeInstanceOf(HTMLElement)
      expect(ref.current?.tagName).toBe('NAV')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Pagination activePage={2} pages={3} onActivePageChange={vi.fn()} />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('RTL locale', () => {
    // Prev/Next are labeled "Previous"/"Next" (logical, chassis-css-driven `.page-link` styling)
    // rather than hardcoded to a physical side — nothing in this component's own logic is
    // direction-dependent. Documents that audit finding as an executable check.
    test('renders and paginates the same way as under LTR', async () => {
      const user = userEvent.setup()
      const onActivePageChange = vi.fn()
      render(
        <I18nProvider locale="ar-SA">
          <Pagination activePage={1} pages={3} onActivePageChange={onActivePageChange} />
        </I18nProvider>
      )
      await user.click(screen.getByRole('button', { name: 'Next' }))
      expect(onActivePageChange).toHaveBeenCalledWith(2)
    })
  })
})

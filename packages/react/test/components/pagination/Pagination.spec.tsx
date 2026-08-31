import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
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
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveAttribute('aria-label', 'Pagination')
      expect(screen.getByRole('list')).toHaveClass('pagination')

      const item = screen.getByRole('button', { name: 'A' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(item.closest('li')).toHaveClass('pagination-item')
      expect(item).toHaveClass('pagination-link')
      expect(item).toHaveAttribute('type', 'button')
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
        'large',
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

    test('moves focus to Previous when clicking Next disables it on the last page', async () => {
      const user = userEvent.setup()
      function Wrapper() {
        const [page, setPage] = React.useState(2)
        return <Pagination activePage={page} pages={3} onActivePageChange={setPage} />
      }
      render(<Wrapper />)

      const next = screen.getByRole('button', { name: 'Next' })
      next.focus()
      // The focus-redirect this asserts on happens in a layout effect that runs off the click's
      // state update — `user.click`'s own act-environment tracking doesn't catch it, so it needs
      // an explicit act(...) wrapper (same pattern as DatePicker.spec.tsx's "focus management"
      // describe block).
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        await user.click(next)
      })

      expect(next).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Previous' })).toHaveFocus()
    })

    test('does not steal focus when jumping to the last page via a page number after a non-boundary Next click', async () => {
      const user = userEvent.setup()
      function Wrapper() {
        const [page, setPage] = React.useState(5)
        return <Pagination activePage={page} pages={10} onActivePageChange={setPage} />
      }
      render(<Wrapper />)

      // Advance one page without crossing a Prev/Next disabled boundary — this used to leave a
      // stale focus-redirect pending internally, since neither control's disabled state changes.
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        await user.click(screen.getByRole('button', { name: 'Next' }))
      })

      // Jump straight to the last page via its number button, not Next — this flips `nextDisabled`
      // and used to wrongly consume the stale pending mark, moving focus to Previous.
      const lastPage = screen.getByRole('button', { name: '10' })
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        await user.click(lastPage)
      })

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Previous' })).not.toHaveFocus()
    })

    test('renders only Prev/Next when showPageNumbers is false', () => {
      render(
        <Pagination activePage={2} pages={3} onActivePageChange={vi.fn()} showPageNumbers={false} />
      )

      expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '1' })).not.toBeInTheDocument()
      expect(screen.queryByText('2')).not.toBeInTheDocument()
    })

    test('renders only page numbers when showPrevNext is false', () => {
      render(
        <Pagination activePage={2} pages={3} onActivePageChange={vi.fn()} showPrevNext={false} />
      )

      expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    })

    test('moves focus to Next when clicking Previous disables it on the first page', async () => {
      const user = userEvent.setup()
      function Wrapper() {
        const [page, setPage] = React.useState(2)
        return <Pagination activePage={page} pages={3} onActivePageChange={setPage} />
      }
      render(<Wrapper />)

      const previous = screen.getByRole('button', { name: 'Previous' })
      previous.focus()
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        await user.click(previous)
      })

      expect(previous).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
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
    // Prev/Next controls use logical, chassis-css-driven `.pagination-link` styling rather than
    // hardcoded to a physical side — nothing in this component's own layout logic is
    // direction-dependent. `previousLabel`/`nextLabel` default to English but can be overridden
    // (here, with Arabic) so the accessible name is translated too, not just the layout.
    test('renders and paginates the same way as under LTR, using caller-supplied translations', async () => {
      const user = userEvent.setup()
      const onActivePageChange = vi.fn()
      render(
        <I18nProvider locale="ar-SA">
          <Pagination
            activePage={1}
            pages={3}
            onActivePageChange={onActivePageChange}
            previousLabel="السابق"
            nextLabel="التالي"
          />
        </I18nProvider>
      )
      await user.click(screen.getByRole('button', { name: 'التالي' }))
      expect(onActivePageChange).toHaveBeenCalledWith(2)
    })
  })
})

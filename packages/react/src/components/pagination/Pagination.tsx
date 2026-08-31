import React, { forwardRef, HTMLAttributes } from 'react'
import { Icon } from '../icon'
import classNames from 'classnames'

import { PaginationItem } from './PaginationItem'
import { usePagination } from '../../hooks'

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  /**
   * Current active page (1-indexed). Used with `pages` for data-driven mode.
   */
  activePage?: number
  /**
   * Set the alignment of pagination components.
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Accessible label for the pagination `<nav>` landmark. Override for non-English locales,
   * or when multiple paginators appear on the same page.
   *
   * @default 'Pagination'
   */
  'aria-label'?: string
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Maximum number of visible page buttons (default: 5). Flanking pages are collapsed to ellipsis.
   */
  maxVisiblePages?: number
  /**
   * Accessible label for the "next page" control, used in smart pagination mode. Override for
   * non-English locales.
   *
   * @default 'Next'
   */
  nextLabel?: string
  /**
   * Callback fired when the active page changes.
   */
  onActivePageChange?: (page: number) => void
  /**
   * Total number of pages. When provided alongside `activePage` and `onActivePageChange`,
   * the component renders a fully-controlled smart paginator with Prev/Next and ellipsis.
   */
  pages?: number
  /**
   * Accessible label for the "previous page" control, used in smart pagination mode. Override
   * for non-English locales.
   *
   * @default 'Previous'
   */
  previousLabel?: string
  /**
   * Show the numbered page buttons in smart pagination mode. Set `false` alongside
   * `showPrevNext` to build a Prev/Next-only paginator.
   *
   * @default true
   */
  showPageNumbers?: boolean
  /**
   * Show the Prev/Next controls in smart pagination mode. Set `false` alongside
   * `showPageNumbers` to build a page-numbers-only paginator.
   *
   * @default true
   */
  showPrevNext?: boolean
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
}

function getPageRange(activePage: number, pages: number, maxVisible: number): (number | '...')[] {
  const safeMaxVisible = Math.max(1, maxVisible)

  if (pages <= safeMaxVisible) {
    return Array.from({ length: pages }, (_, i) => i + 1)
  }

  const half = Math.floor(safeMaxVisible / 2)
  let start = Math.max(1, activePage - half)
  const end = Math.min(pages, start + safeMaxVisible - 1)

  if (end - start < safeMaxVisible - 1) {
    start = Math.max(1, end - safeMaxVisible + 1)
  }

  const result: (number | '...')[] = []

  if (start > 1) {
    result.push(1)
    if (start > 2) result.push('...')
  }

  for (let i = start; i <= end; i++) {
    result.push(i)
  }

  if (end < pages) {
    if (end < pages - 1) result.push('...')
    result.push(pages)
  }

  return result
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      activePage = 1,
      align,
      'aria-label': ariaLabel = 'Pagination',
      children,
      className,
      maxVisiblePages = 5,
      nextLabel = 'Next',
      onActivePageChange,
      pages,
      previousLabel = 'Previous',
      showPageNumbers = true,
      showPrevNext = true,
      size,
      ...rest
    },
    ref
  ) => {
    const _className = classNames(
      'pagination',
      size,
      {
        [`justify-content-${align}`]: align
      },
      className
    )

    const clampedActivePage = pages ? Math.min(Math.max(activePage, 1), pages) : activePage
    const prevDisabled = pages ? clampedActivePage <= 1 : false
    const nextDisabled = pages ? clampedActivePage >= pages : false

    const { prevRef, nextRef, handlePrevClick, handleNextClick } = usePagination({
      prevDisabled,
      nextDisabled,
      onPrev: () => onActivePageChange && onActivePageChange(clampedActivePage - 1),
      onNext: () => onActivePageChange && onActivePageChange(clampedActivePage + 1)
    })

    const smartContent = pages ? (
      <>
        {showPrevNext && (
          <PaginationItem
            ref={prevRef}
            disabled={prevDisabled}
            onClick={handlePrevClick}
            aria-label={previousLabel}
          >
            <Icon name="chevron-left-solid" className="directional-icon" />
          </PaginationItem>
        )}
        {showPageNumbers &&
          getPageRange(clampedActivePage, pages, maxVisiblePages).map((page, idx) =>
            page === '...' ? (
              // eslint-disable-next-line react/no-array-index-key
              <PaginationItem key={`ellipsis-${idx}`} disabled component="span" aria-hidden="true">
                &hellip;
              </PaginationItem>
            ) : (
              <PaginationItem
                key={page}
                active={page === clampedActivePage}
                onClick={() => onActivePageChange && onActivePageChange(page)}
              >
                {page}
              </PaginationItem>
            )
          )}
        {showPrevNext && (
          <PaginationItem
            ref={nextRef}
            disabled={nextDisabled}
            onClick={handleNextClick}
            aria-label={nextLabel}
          >
            <Icon name="chevron-right-solid" className="directional-icon" />
          </PaginationItem>
        )}
      </>
    ) : null

    return (
      <nav aria-label={ariaLabel} ref={ref} {...rest}>
        <ul className={_className}>{smartContent ?? children}</ul>
      </nav>
    )
  }
)

Pagination.displayName = 'Pagination'

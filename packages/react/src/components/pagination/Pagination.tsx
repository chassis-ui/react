import React, { forwardRef, HTMLAttributes, useEffect, useRef } from 'react'
import { Icon } from '../icon'
import classNames from 'classnames'

import { PaginationItem } from './PaginationItem'

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
      size,
      ...rest
    },
    ref
  ) => {
    const _className = classNames(
      'pagination',
      {
        [`justify-content-${align}`]: align,
        [`pagination-${size}`]: size
      },
      className
    )

    const clampedActivePage = pages ? Math.min(Math.max(activePage, 1), pages) : activePage

    const prevRef = useRef<HTMLAnchorElement>(null)
    const nextRef = useRef<HTMLAnchorElement>(null)
    const pendingFocusFix = useRef<'prev' | 'next' | null>(null)

    // Native `disabled` buttons are blurred by the browser the moment they're disabled. Clicking
    // Prev/Next into the first/last page disables that very button, silently dropping focus to
    // <body>. Redirect focus to the still-enabled sibling when that happens.
    useEffect(() => {
      if (!pages || !pendingFocusFix.current) return
      const from = pendingFocusFix.current
      pendingFocusFix.current = null
      if (from === 'prev' && clampedActivePage <= 1) {
        nextRef.current?.focus()
      } else if (from === 'next' && clampedActivePage >= pages) {
        prevRef.current?.focus()
      }
    }, [clampedActivePage, pages])

    const smartContent = pages ? (
      <>
        <PaginationItem
          ref={prevRef}
          disabled={clampedActivePage <= 1}
          onClick={() => {
            pendingFocusFix.current = 'prev'
            onActivePageChange && onActivePageChange(clampedActivePage - 1)
          }}
          aria-label={previousLabel}
        >
          <Icon name="chevron-left-solid" className="directional-icon" />
        </PaginationItem>
        {getPageRange(clampedActivePage, pages, maxVisiblePages).map((page, idx) =>
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
        <PaginationItem
          ref={nextRef}
          disabled={clampedActivePage >= pages}
          onClick={() => {
            pendingFocusFix.current = 'next'
            onActivePageChange && onActivePageChange(clampedActivePage + 1)
          }}
          aria-label={nextLabel}
        >
          <Icon name="chevron-right-solid" className="directional-icon" />
        </PaginationItem>
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

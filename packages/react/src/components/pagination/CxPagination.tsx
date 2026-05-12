import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { CxPaginationItem } from './CxPaginationItem'

export interface CPaginationProps extends HTMLAttributes<HTMLUListElement> {
  /**
   * Current active page (1-indexed). Used with `pages` for data-driven mode.
   */
  activePage?: number
  /**
   * Set the alignment of pagination components.
   */
  align?: 'start' | 'center' | 'end'
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Maximum number of visible page buttons (default: 5). Flanking pages are collapsed to ellipsis.
   */
  maxVisiblePages?: number
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
   * Size the component small or large.
   */
  size?: 'small' | 'large'
}

function getPageRange(
  activePage: number,
  pages: number,
  maxVisible: number,
): (number | '...')[] {
  if (pages <= maxVisible) {
    return Array.from({ length: pages }, (_, i) => i + 1)
  }

  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, activePage - half)
  let end = Math.min(pages, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
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

export const CxPagination = forwardRef<HTMLUListElement, CPaginationProps>(
  (
    {
      activePage = 1,
      align,
      children,
      className,
      maxVisiblePages = 5,
      onActivePageChange,
      pages,
      size,
      ...rest
    },
    ref,
  ) => {
    const _className = classNames(
      'pagination',
      {
        [`justify-content-${align}`]: align,
        [`pagination-${size}`]: size,
      },
      className,
    )

    const smartContent = pages ? (
      <>
        <CxPaginationItem
          disabled={activePage <= 1}
          onClick={() => onActivePageChange && onActivePageChange(activePage - 1)}
          aria-label="Previous"
        >
          &laquo;
        </CxPaginationItem>
        {getPageRange(activePage, pages, maxVisiblePages).map((page, idx) =>
          page === '...' ? (
            <CxPaginationItem key={`ellipsis-${idx}`} disabled>
              &hellip;
            </CxPaginationItem>
          ) : (
            <CxPaginationItem
              key={page}
              active={page === activePage}
              onClick={() => onActivePageChange && onActivePageChange(page)}
            >
              {page}
            </CxPaginationItem>
          ),
        )}
        <CxPaginationItem
          disabled={activePage >= pages}
          onClick={() => onActivePageChange && onActivePageChange(activePage + 1)}
          aria-label="Next"
        >
          &raquo;
        </CxPaginationItem>
      </>
    ) : null

    return (
      <nav ref={ref} {...rest}>
        <ul className={_className}>{smartContent ?? children}</ul>
      </nav>
    )
  },
)

CxPagination.propTypes = {
  activePage: PropTypes.number,
  align: PropTypes.oneOf(['start', 'center', 'end']),
  children: PropTypes.node,
  className: PropTypes.string,
  maxVisiblePages: PropTypes.number,
  onActivePageChange: PropTypes.func,
  pages: PropTypes.number,
  size: PropTypes.oneOf(['small', 'large']),
}

CxPagination.displayName = 'CxPagination'

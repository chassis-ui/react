'use client'

import '../../utils/suppressFocusRingGlobally'

export { Pagination } from './Pagination'
export type { PaginationProps } from './Pagination'
export { PaginationItem } from './PaginationItem'
export type { PaginationItemProps } from './PaginationItem'
// Also exported from the package root; repeated here so this folder's subpath entry
// (`@chassis-ui/react/<folder>`) covers the whole family without reaching back to the root.
export { usePagination } from '../../hooks/usePagination'
export type { UsePaginationResult } from '../../hooks/usePagination'

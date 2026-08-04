import { Pagination as PaginationRoot } from './Pagination'
import { PaginationItem } from './PaginationItem'
// plop:sub-import

export const Pagination = Object.assign(PaginationRoot, {
  // plop:sub-entry
  Item: PaginationItem
})
export type { PaginationProps } from './Pagination'
export type { PaginationItemProps } from './PaginationItem'
// plop:sub-type

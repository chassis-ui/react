import { Breadcrumb as BreadcrumbRoot } from './Breadcrumb'
import { BreadcrumbItem } from './BreadcrumbItem'
// plop:sub-import

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  // plop:sub-entry
  Item: BreadcrumbItem
})
export type { BreadcrumbProps, BreadcrumbItemDef } from './Breadcrumb'
export type { BreadcrumbItemProps } from './BreadcrumbItem'
// plop:sub-type

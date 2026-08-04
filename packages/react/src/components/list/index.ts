import { List as ListRoot } from './List'
import { ListItem } from './ListItem'
// plop:sub-import

export const List = Object.assign(ListRoot, {
  // plop:sub-entry
  Item: ListItem
})
export type { ListProps, ListItemDef } from './List'
export type { ListItemProps } from './ListItem'
// plop:sub-type

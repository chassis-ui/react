import { Menu as MenuRoot } from './Menu'
import { MenuDivider } from './MenuDivider'
import { MenuHeader } from './MenuHeader'
import { MenuItem } from './MenuItem'
import { MenuList } from './MenuList'
import { MenuText } from './MenuText'
import { MenuToggle } from './MenuToggle'
import { Submenu as SubmenuRoot } from './Submenu'
import { SubmenuBack } from './SubmenuBack'
// plop:sub-import

// Submenu is composed as a Menu.List child exactly like Menu.Item (see site examples), not a
// standalone top-level component — so it's exposed as Menu.Submenu, not a bare `Submenu` export.
// SubmenuBack only makes sense as the first item of a stacked Submenu's own nested list, hence
// the second level of nesting: Menu.Submenu.Back.
const Submenu = Object.assign(SubmenuRoot, {
  Back: SubmenuBack
})

export const Menu = Object.assign(MenuRoot, {
  // plop:sub-entry
  Divider: MenuDivider,
  Header: MenuHeader,
  Item: MenuItem,
  List: MenuList,
  Text: MenuText,
  Toggle: MenuToggle,
  Submenu
})
export type { MenuProps, MenuFocusStrategy, MenuAutoClose } from './Menu'
export type { MenuDividerProps } from './MenuDivider'
export type { MenuHeaderProps } from './MenuHeader'
export type { MenuItemProps } from './MenuItem'
export type { MenuListProps } from './MenuList'
export type { MenuTextProps } from './MenuText'
export type { MenuToggleProps } from './MenuToggle'
export type { SubmenuProps } from './Submenu'
export type { SubmenuBackProps } from './SubmenuBack'
export type { MenuItemDef, MenuHeaderDef, MenuDividerDef, MenuItemsDef } from './MenuItemDef'
// plop:sub-type

import { Nav as NavRoot } from './Nav'
import { NavItem } from './NavItem'
import { NavLink } from './NavLink'
import { NavTitle } from './NavTitle'
// plop:sub-import

export const Nav = Object.assign(NavRoot, {
  // plop:sub-entry
  Item: NavItem,
  Link: NavLink,
  Title: NavTitle
})
export type { NavProps, NavItemDef } from './Nav'
export type { NavLinkProps } from './NavLink'
export type { NavTitleProps } from './NavTitle'
// plop:sub-type

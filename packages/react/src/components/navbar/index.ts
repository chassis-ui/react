import { Navbar as NavbarRoot } from './Navbar'
import { NavbarBrand } from './NavbarBrand'
import { NavbarNav } from './NavbarNav'
import { NavbarText } from './NavbarText'
import { NavbarToggler } from './NavbarToggler'
// plop:sub-import

export const Navbar = Object.assign(NavbarRoot, {
  // plop:sub-entry
  Brand: NavbarBrand,
  Nav: NavbarNav,
  Text: NavbarText,
  Toggler: NavbarToggler
})
export type { NavbarProps } from './Navbar'
export type { NavbarBrandProps } from './NavbarBrand'
export type { NavbarNavProps } from './NavbarNav'
export type { NavbarTextProps } from './NavbarText'
export type { NavbarTogglerProps } from './NavbarToggler'
// plop:sub-type

import { Drawer as DrawerRoot } from './Drawer'
import { DrawerBody } from './DrawerBody'
import { DrawerFooter } from './DrawerFooter'
import { DrawerHeader } from './DrawerHeader'
import { DrawerTitle } from './DrawerTitle'
// plop:sub-import

export const Drawer = Object.assign(DrawerRoot, {
  // plop:sub-entry
  Body: DrawerBody,
  Footer: DrawerFooter,
  Header: DrawerHeader,
  Title: DrawerTitle
})
export type { DrawerProps } from './Drawer'
export type { DrawerBodyProps } from './DrawerBody'
export type { DrawerFooterProps } from './DrawerFooter'
export type { DrawerHeaderProps } from './DrawerHeader'
export type { DrawerTitleProps } from './DrawerTitle'
// plop:sub-type

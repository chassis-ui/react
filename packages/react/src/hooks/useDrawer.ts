import { useContext } from 'react'
import { DrawerContext, DrawerContextProps } from '../components/drawer/Drawer'

export type UseDrawerResult = DrawerContextProps

// Reach the enclosing `Drawer`'s close handler from anywhere in its composed markup — e.g. to
// close it from a plain `Button` placed in a `DrawerFooter`. Only meaningful inside a `Drawer`;
// outside one it returns a no-op `close`.
export const useDrawer = (): UseDrawerResult => useContext(DrawerContext)

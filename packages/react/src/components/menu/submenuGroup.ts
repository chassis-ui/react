import { createContext, useRef } from 'react'

// Lets sibling `.submenu` flyouts at the same menu level close one another when a new one
// opens, mirroring menu.js's `_closeSiblingSubmenus`. One provider instance is created per
// menu level (the top-level `.menu` and each `.submenu`'s own nested list) and lives for the
// lifetime of that level, so registration doesn't churn on every render.
export interface SubmenuGroupContextValue {
  register: (id: string, close: () => void) => () => void
  notifyOpen: (id: string) => void
}

export const SubmenuGroupContext = createContext<SubmenuGroupContextValue | null>(null)

export const useSubmenuGroupProvider = (): SubmenuGroupContextValue => {
  const ref = useRef<SubmenuGroupContextValue | null>(null)

  if (!ref.current) {
    const closers = new Map<string, () => void>()
    ref.current = {
      register: (id, close) => {
        closers.set(id, close)
        return () => {
          closers.delete(id)
        }
      },
      notifyOpen: (id) => {
        closers.forEach((close, key) => {
          if (key !== id) close()
        })
      }
    }
  }

  return ref.current
}

// Exposes the current `.submenu`'s own close-and-refocus action to a nested `MenuSubmenuBack`
// button, without threading it through the sibling-group registry above.
export interface SubmenuActionsContextValue {
  close: () => void
}

export const SubmenuActionsContext = createContext<SubmenuActionsContextValue | null>(null)

// Whether the `.submenu` a nested `MenuSubmenu` is in is open. A submenu's panel is portaled out
// of its parent's, so nothing hides it when the parent closes: it follows this, as the first
// level follows the `Menu` itself. `true` at the top level, where there is no parent submenu.
export const SubmenuVisibleContext = createContext(true)

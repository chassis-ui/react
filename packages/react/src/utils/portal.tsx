import React, { ReactNode, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

// Nothing to subscribe to: the value only differs between the server snapshot and the client one.
const subscribe = () => () => {}

/**
 * `false` on the server and during hydration, `true` afterwards and in a client-only render. React
 * hydrates against the server snapshot, then re-renders with the client one once hydration has
 * finished, so a component can render something that only exists on the client without
 * mismatching the server's HTML.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

export interface PortalProps {
  children: ReactNode
  /**
   * Where the children are portaled. Defaults to `document.body`.
   */
  container?: Element | DocumentFragment | null
  /**
   * Rendered in place until the portal exists: on the server and during hydration. Nothing by
   * default.
   */
  fallback?: ReactNode
}

/**
 * `createPortal` that is safe to server-render and hydrate. A portal has no server equivalent, so
 * `typeof window !== 'undefined' && createPortal(...)` renders nothing on the server and the
 * portal's content on the client's first render; React's hydration then walks into content the
 * server never sent and reports a mismatch. `Portal` renders `fallback` until hydration has
 * finished, then portals `children`. A client-only render portals immediately.
 */
export function Portal({ children, container, fallback = null }: PortalProps) {
  const hydrated = useHydrated()
  if (!hydrated) return <>{fallback}</>
  return createPortal(children, container ?? document.body)
}

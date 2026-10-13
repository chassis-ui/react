import React, { ReactElement, ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { useHydrated } from '../../hooks/useHydrated'

export interface PortalProps {
  /**
   * The content to render in the portal.
   */
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

// A portal has no server equivalent. `typeof window !== 'undefined' && createPortal(...)` renders
// nothing on the server and the portal's content on the client's first render, so hydration walks
// into content the server never sent and reports a mismatch. `Portal` renders `fallback` until
// hydration has finished, then portals `children`; a client-only render portals immediately.
/**
 * Renders its children into `container` (`document.body` by default), and renders `fallback` on the
 * server and during hydration, so server-rendered pages hydrate without a mismatch.
 */
export function Portal({ children, container, fallback }: PortalProps): ReactElement {
  const hydrated = useHydrated()
  if (!hydrated) return <>{fallback}</>
  return createPortal(children, container ?? document.body)
}

Portal.displayName = 'Portal'

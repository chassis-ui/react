import { useSyncExternalStore } from 'react'

// Nothing to subscribe to: the value only differs between the server snapshot and the client one.
const subscribe = () => () => {}

/**
 * `false` on the server and during hydration, `true` afterwards and in a client-only render. React
 * hydrates against the server snapshot, then re-renders with the client one once hydration has
 * finished, so a component can render something that only exists in the browser without
 * mismatching the server's HTML.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

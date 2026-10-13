'use client'

import '../../utils/suppressFocusRingGlobally'

export { Portal } from './Portal'
// Published from this entry too, so `@chassis-ui/react/portal` keeps the hook `Portal` is built on.
export { useHydrated } from '../../hooks/useHydrated'
export type { PortalProps } from './Portal'

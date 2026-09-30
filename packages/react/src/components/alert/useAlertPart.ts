import { useRef } from 'react'

import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import { AlertPartKind, useAlertContext } from './Alert'

// Registers the element behind the returned ref with the enclosing `Alert`, under the id it has in
// the DOM after each commit. That is the part's own id, a caller's `id`, or, under `asChild`, the
// child's own id, which wins over the part's. A changed id registers again; unmounting takes the
// element out. Outside an `Alert` it does nothing.
export function useAlertPart(kind: AlertPartKind) {
  const nodeRef = useRef<HTMLElement | null>(null)
  const { registerPart } = useAlertContext()
  const registered = useRef<{ id?: string; unregister?: () => void }>({})

  useIsomorphicLayoutEffect(() => {
    const node = nodeRef.current
    const id = node?.id || undefined
    if (id === registered.current.id) return
    registered.current.unregister?.()
    registered.current = node && id ? { id, unregister: registerPart(kind, node, id) } : {}
  })

  useIsomorphicLayoutEffect(
    () => () => {
      registered.current.unregister?.()
      registered.current = {}
    },
    [registerPart]
  )

  return nodeRef
}

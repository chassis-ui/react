import { useCallback, useState } from 'react'

import { useHydrated } from './useHydrated'

export type RegisterDialogTitle = (id: string) => () => void

// The title a `Modal` or a `Drawer` is labelled by. `ModalTitle` and `DrawerTitle` register the id
// they have in the DOM, from a layout effect, and take it out when they unmount, so the dialog's
// `aria-labelledby` names an element that is there: the generated id of the context, or the `id`
// a caller gave the title. A dialog with no title has no `aria-labelledby`, which would be a
// dangling reference, and one that outranks a caller's `aria-label` besides.
//
// An effect doesn't run on a server, so until hydration the label is `serverTitleId()`: the id of
// a title the dialog's children are seen to render (`findDialogTitleId`) when the dialog is
// rendered open, and none for a closed dialog, which nothing reads a name from. Hydration renders
// that value again, so it never mismatches, then settles on what registered.
export function useDialogTitle(
  serverTitleId: () => string | undefined
): [string | undefined, RegisterDialogTitle] {
  const hydrated = useHydrated()
  const [titleId, setTitleId] = useState<string>()
  const registerTitle = useCallback<RegisterDialogTitle>((id) => {
    setTitleId(id)
    return () => setTitleId((current) => (current === id ? undefined : current))
  }, [])

  return [hydrated ? titleId : serverTitleId(), registerTitle]
}

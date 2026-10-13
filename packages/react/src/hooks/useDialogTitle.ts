import { useCallback, useState } from 'react'

import { useHydrated } from '../components/portal/Portal'

export type RegisterDialogTitle = (id: string) => () => void

// The title a `Modal` or a `Drawer` is labelled by. `ModalTitle` and `DrawerTitle` register the id
// they have in the DOM, from a layout effect, and take it out when they unmount, so the dialog's
// `aria-labelledby` names an element that is there: the generated id of the context, or the `id`
// a caller gave the title. A dialog with no title has no `aria-labelledby`, which would be a
// dangling reference, and one that outranks a caller's `aria-label` besides.
//
// A server can't know what the dialog's children render, and an effect doesn't run there. Its
// HTML names `generatedId`, the id a title takes by default, so a dialog rendered open is named
// before the JavaScript loads; hydration then settles on what registered.
export function useDialogTitle(generatedId: string): [string | undefined, RegisterDialogTitle] {
  const hydrated = useHydrated()
  const [titleId, setTitleId] = useState<string>()
  const registerTitle = useCallback<RegisterDialogTitle>((id) => {
    setTitleId(id)
    return () => setTitleId((current) => (current === id ? undefined : current))
  }, [])

  return [hydrated ? titleId : generatedId, registerTitle]
}

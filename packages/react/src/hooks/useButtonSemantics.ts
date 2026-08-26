import { MouseEventHandler, Ref, RefObject, useRef } from 'react'
import { AriaButtonProps, useButton } from 'react-aria'

import { useForkedRef } from './useForkedRef'

interface UseButtonSemanticsOptions<T extends HTMLElement> {
  disabled?: boolean
  onClick?: MouseEventHandler<T>
}

// Synthesizes native button semantics (role, tabIndex, Enter/Space activation) for a
// non-native `component` — a `<button>`/`<a>`/`<input>` gets all of this for free from the
// browser, but an arbitrary `component` (e.g. `'div'`, `'span'`) doesn't. Shared by
// `Link`/`Button`/`CloseButton`, which otherwise duplicated this ref/hook wiring near-verbatim.
// `elementType: 'div'` and the `HTMLDivElement` cast below are fixed regardless of the actual
// rendered tag — `useButton` only uses `elementType` to pick which ARIA attributes apply
// (a `div`-shaped set is the right one for an arbitrary non-native element either way), not to
// constrain the ref's real type.
export const useButtonSemantics = <T extends HTMLElement>(
  ref: Ref<T>,
  { disabled, onClick }: UseButtonSemanticsOptions<T>
) => {
  const buttonRef = useRef<T | null>(null)
  const forkedRef = useForkedRef(ref, buttonRef)
  const buttonAriaProps: AriaButtonProps<'div'> = {
    elementType: 'div',
    isDisabled: disabled,
    onClick: onClick as unknown as AriaButtonProps<'div'>['onClick']
  }
  const { buttonProps } = useButton(buttonAriaProps, buttonRef as RefObject<HTMLDivElement | null>)

  return { buttonProps, forkedRef }
}

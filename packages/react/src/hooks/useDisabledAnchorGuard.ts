import { MouseEvent, MouseEventHandler } from 'react'

// A native `<button>`/`<input>` stops firing `click` on its own once `disabled` is set — an
// `<a>` (or any other non-native-button element standing in for one) has no real `disabled`
// attribute, so it still fires click (and an anchor still navigates) unless blocked by hand.
// `guard` is the caller's own "is this rendering as a non-native-button element" check (e.g.
// `Component === 'a'` for `Button`/`CloseButton`, `!isButton` for `Chip`) — kept as an explicit
// parameter rather than inferred here, since each caller's own set of native, guard-free elements
// differs slightly.
export const useDisabledAnchorGuard = <T extends HTMLElement>(
  guard: boolean,
  disabled: boolean | undefined,
  onClick: MouseEventHandler<T> | undefined
): MouseEventHandler<T> => {
  return (event: MouseEvent<T>) => {
    if (guard && disabled) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }
}

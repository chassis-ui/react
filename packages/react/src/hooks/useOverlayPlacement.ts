import { CSSProperties, HTMLAttributes, RefObject } from 'react'
import { mergeProps, useOverlay, useOverlayPosition } from 'react-aria'
import { OverlayTriggerState } from 'react-stately'

import { resolveDataPlacement, toAriaPlacement } from '../utils/overlayPlacement'

interface UseOverlayPlacementProps {
  overlayRef: RefObject<HTMLElement | null>
  state: OverlayTriggerState
  triggerRef: RefObject<HTMLElement | null>
}

interface UseOverlayPlacementResult {
  overlayStyle: CSSProperties
  placementAttr: string
  // Re-typed as plain HTML attributes for the same `rollup-plugin-dts` portability reason as
  // before (see git history) — react-aria's own return type pulls in a `FocusableElement`
  // reference the bundled `.d.ts` can't always resolve a portable name for.
  overlayDismissProps: HTMLAttributes<HTMLElement>
}

// Shared by `DatePicker` and `DateRangePicker` — both position their calendar overlay the same
// way (`bottom-start`, 2px offset, closing on Escape, on any click outside it, or when focus leaves
// the trigger group). Lives in `hooks/` rather than `components/datepicker/` like every other hook
// in this library, regardless of how many components use it — see `useFormField` for the same
// treatment despite having many more callers.
//
// Built directly on `useOverlay` + `useOverlayPosition` rather than the higher-level `usePopover`
// combo hook. `usePopover` computes its own internal `onClose` for `useOverlayPosition` from
// `isNonModal` (`isNonModal && !isSubmenu ? state.close : null`, neither overridable by a caller),
// and `isNonModal: true` — needed so the calendar doesn't lock page scroll or aria-hide the rest of
// the page, since it was never meant to be modal — unconditionally arms `useOverlayPosition`'s
// close-on-any-window-scroll listener (`useCloseOnScroll`, keyed off `onClose !== null`) as a side
// effect. That's wrong here: the calendar should reposition with its trigger when the page scrolls,
// not disappear. Calling the two lower-level hooks directly, with `onClose: null` passed to
// `useOverlayPosition` alone, gets the positioning and Escape/blur dismissal this calendar needs
// without arming that listener — the same fix already applied to `Autocomplete`/`Combobox`/
// `Menu`/`MenuSubmenu`/`Popover`, none of which use `usePopover` either, all for this same reason.
export const useOverlayPlacement = ({
  overlayRef,
  state,
  triggerRef
}: UseOverlayPlacementProps): UseOverlayPlacementResult => {
  // The trigger's own toggle button lives inside `triggerRef`, not `overlayRef` — without this,
  // focus moving there when the button is pressed would count as an "outside" interaction and
  // close the overlay, which the button's own `onPress` then immediately reopens on click.
  const shouldCloseOnInteractOutside = (element: Element) => !triggerRef.current?.contains(element)

  // Escape key + outside-interaction dismissal — the two pieces of `usePopover`'s bundled behavior
  // this calendar still needs. `isDismissable: true` — *not* `usePopover`'s own default of `false`
  // whenever `isNonModal` is true — is required to actually get outside-*click* dismissal:
  // `useOverlay`'s `shouldCloseOnBlur` only closes on a focus-based blur, and explicitly bails when
  // the click target isn't focusable (`relatedTarget` is `null`, i.e. focus lands on `document.body`,
  // as it does for an ordinary click on plain page content) — its own source comments that this case
  // is intentionally left to the separate pointerdown-outside listener `useOverlay` only wires up
  // when `isDismissable` is true. Leaving it at the `usePopover`-matching default therefore silently
  // drops the single most common way users try to dismiss a popover.
  const { overlayProps } = useOverlay(
    {
      isDismissable: true,
      isOpen: state.isOpen,
      onClose: state.close,
      shouldCloseOnBlur: true,
      shouldCloseOnInteractOutside
    },
    overlayRef
  )

  const { overlayProps: positionProps, placement: resolvedPlacement } = useOverlayPosition({
    isOpen: state.isOpen,
    offset: 2,
    // Opts out of `useOverlayPosition`'s own close-on-any-window-scroll listener — see this hook's
    // own comment above. Leaving this `undefined` would NOT disable it: `useCloseOnScroll` only
    // early-returns on `onClose === null`, not merely falsy.
    onClose: null,
    overlayRef,
    placement: toAriaPlacement('bottom-start'),
    targetRef: triggerRef
  })

  const { style: overlayPositionStyle, ...overlayDismissProps } = mergeProps(
    overlayProps,
    positionProps
  )
  const overlayStyle: CSSProperties = {
    position: overlayPositionStyle?.position as CSSProperties['position'],
    top: overlayPositionStyle?.top,
    left: overlayPositionStyle?.left
  }
  const placementAttr = resolveDataPlacement('bottom-start', resolvedPlacement)

  return { overlayStyle, placementAttr, overlayDismissProps }
}

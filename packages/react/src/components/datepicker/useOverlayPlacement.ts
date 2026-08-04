import { CSSProperties, HTMLAttributes, RefObject } from 'react'
import { mergeProps, useOverlay, useOverlayPosition } from 'react-aria'
import { OverlayTriggerState } from 'react-stately'

import { resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'

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

// Shared by `CxDatePicker` and `CxDateRangePicker` — both position their calendar overlay the same
// way (`bottom-start`, 2px offset, closing on Escape or when focus leaves the trigger group).
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
// without arming that listener — the same fix already applied to `CxAutocomplete`/`CxCombobox`/
// `CxMenu`/`CxSubmenu`/`CxPopover`, none of which use `usePopover` either, all for this same reason.
export const useOverlayPlacement = ({
  overlayRef,
  state,
  triggerRef
}: UseOverlayPlacementProps): UseOverlayPlacementResult => {
  // The trigger's own toggle button lives inside `triggerRef`, not `overlayRef` — without this,
  // focus moving there when the button is pressed would count as an "outside" interaction and
  // close the overlay, which the button's own `onPress` then immediately reopens on click.
  const shouldCloseOnInteractOutside = (element: Element) => !triggerRef.current?.contains(element)

  // Escape key + focus-leaves-the-overlay dismissal — the two pieces of `usePopover`'s bundled
  // behavior this calendar still needs. `isDismissable` is left at its default (`false`), matching
  // the value `usePopover` itself computes whenever `isNonModal` is true (as it always is for this
  // calendar): outside-*click* dismissal happens via `shouldCloseOnBlur`'s focus-leaves-the-overlay
  // check, not a separate pointerdown listener — `usePopover` doesn't wire that one either in the
  // non-modal case.
  //
  // Deliberately not reproducing `usePopover`'s `usePreventScroll`/`ariaHideOutside` calls on top
  // of this: `usePreventScroll`'s `isDisabled: isNonModal || !state.isOpen` is always true here
  // (this calendar is always non-modal), so it was already a permanent no-op; `ariaHideOutside`'s
  // `keepVisible` counterpart (exempting this overlay from being aria-hidden if some *other*, modal
  // overlay happens to be open at the same time) lives only on a private, unexported react-aria
  // subpath — the same trade-off `CxAutocomplete`/`CxCombobox`/`CxMenu`/`CxSubmenu`/`CxPopover`
  // already accept for opting out of `usePopover`, none of them reproducing it either.
  const { overlayProps } = useOverlay(
    {
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

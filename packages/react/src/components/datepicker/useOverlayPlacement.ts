import { CSSProperties, HTMLAttributes, RefObject } from 'react'
import { usePopover } from 'react-aria'
import { OverlayTriggerState } from 'react-stately'

import { resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'

interface UseOverlayPlacementProps {
  popoverRef: RefObject<HTMLElement | null>
  state: OverlayTriggerState
  triggerRef: RefObject<HTMLElement | null>
}

interface UseOverlayPlacementResult {
  overlayStyle: CSSProperties
  placementAttr: string
  // `usePopover`'s own `popoverProps` type pulls in `@react-types/shared`'s `DOMAttributes`, whose
  // event handlers reference `FocusableElement` — a type `rollup-plugin-dts` can't always resolve
  // a portable name for in the bundled `.d.ts`. Re-typed here as the plain HTML attributes it's
  // actually spread onto (a `<div>` in both callers), which every prop it carries (aria-*,
  // onKeyDown, etc.) is structurally assignable to.
  popoverDismissProps: HTMLAttributes<HTMLElement>
}

// Shared by `CxDatePicker` and `CxDateRangePicker` — both position their calendar popover the same
// way (`bottom-start`, 2px offset, closing only on interaction outside the trigger group). Wraps
// `usePopover` and splits its computed `style` back apart: only position/top/left are wanted (no
// `zIndex`/`maxHeight` overrides — chassis-css owns those), the rest are the escape/outside-click
// dismissal props the caller still needs to spread onto the popover element.
export const useOverlayPlacement = ({
  popoverRef,
  state,
  triggerRef
}: UseOverlayPlacementProps): UseOverlayPlacementResult => {
  const { popoverProps, placement: resolvedPlacement } = usePopover(
    {
      triggerRef,
      popoverRef,
      placement: toAriaPlacement('bottom-start'),
      offset: 2,
      // The trigger's own toggle button lives inside `triggerRef`, not `popoverRef` — without this
      // it would count as an "outside" interaction and `usePopover` would close the popover on
      // pointerdown, which the toggle button's own `onPress` then immediately reopens on click.
      shouldCloseOnInteractOutside: (element) => !triggerRef.current?.contains(element),
      // Without this, `usePopover` defaults to modal behavior: it locks page scroll
      // (`usePreventScroll`) for as long as the calendar is open and `aria-hide`s the rest of the
      // page from assistive tech. The calendar was never meant to be modal — it should scroll
      // with the page like `CxAutocomplete`'s panel does, not block it.
      isNonModal: true
    },
    state
  )

  const { style: popoverPositionStyle, ...popoverDismissProps } = popoverProps
  const overlayStyle: CSSProperties = {
    position: popoverPositionStyle?.position as CSSProperties['position'],
    top: popoverPositionStyle?.top,
    left: popoverPositionStyle?.left
  }
  const placementAttr = resolveDataPlacement('bottom-start', resolvedPlacement)

  return { overlayStyle, placementAttr, popoverDismissProps }
}

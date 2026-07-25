import type { Placement as AriaPlacement, PlacementAxis } from 'react-aria'

// Chassis CSS's floating components (`.menu`, `.tooltip`, `.popover`) read a `data-cx-placement`
// attribute in this hyphenated, compound form (`"bottom-end"`, `"top-start"`, ...) to pick the
// right transform-origin for the open/close animation. React Aria's `useOverlayPosition` speaks a
// different, space-separated placement vocabulary (`"bottom end"`) and only reports back the
// resolved main axis after flipping, not the full compound value — this module bridges the two.
export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

const ARIA_PLACEMENT: Record<Placement, AriaPlacement> = {
  top: 'top',
  'top-start': 'top start',
  'top-end': 'top end',
  bottom: 'bottom',
  'bottom-start': 'bottom start',
  'bottom-end': 'bottom end',
  left: 'left',
  'left-start': 'left top',
  'left-end': 'left bottom',
  right: 'right',
  'right-start': 'right top',
  'right-end': 'right bottom',
}

// Translates chassis-react's public `placement` prop values into the strings
// `useOverlayPosition` expects.
export const toAriaPlacement = (placement: Placement): AriaPlacement => ARIA_PLACEMENT[placement]

// `useOverlayPosition`'s own `shouldFlip` only ever swaps the main axis (top<->bottom or
// left<->right) — it never changes the requested cross-axis alignment — so the resolved compound
// value is always the requested cross-axis suffix reattached to the (possibly flipped) main axis
// `useOverlayPosition` reports back.
export const resolveDataPlacement = (
  requested: Placement,
  resolvedMain: PlacementAxis | null,
): string => {
  if (!resolvedMain || resolvedMain === 'center') return requested
  const cross = requested.split('-')[1]
  return cross ? `${resolvedMain}-${cross}` : resolvedMain
}

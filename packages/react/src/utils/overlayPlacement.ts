import type { CSSProperties } from 'react'
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
  'right-end': 'right bottom'
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
  resolvedMain: PlacementAxis | null
): string => {
  if (!resolvedMain || resolvedMain === 'center') return requested
  const cross = requested.split('-')[1]
  return cross ? `${resolvedMain}-${cross}` : resolvedMain
}

// Shared between `Menu`/`MenuSubmenu` and `Combobox`/`Autocomplete`, whose floating panels all
// position via `useOverlayPosition` the same way: only `position`/`top`/`left` are taken from the
// hook's computed style (`zIndex`/`maxHeight` stay owned by chassis-css's own `--zindex`/
// `--max-height` tokens, see `_menu.scss`), and `data-cx-placement` needs the resolved main axis
// reattached to the originally-requested cross-axis alignment. Lives here (rather than
// `components/menu/`) for the same reason `renderMenuItemContent` does — `Combobox.tsx`/
// `Autocomplete.tsx` need it too, and importing across that folder boundary from three call sites
// is worse than housing it where none of the four has to reach into a sibling's folder.
export interface MenuOverlayPositioning {
  menuStyle: CSSProperties
  placementAttr: string
}

export const resolveMenuOverlayPositioning = (
  overlayStyle: CSSProperties | undefined,
  requestedPlacement: Placement,
  resolvedPlacement: PlacementAxis | null
): MenuOverlayPositioning => ({
  menuStyle: {
    position: overlayStyle?.position,
    top: overlayStyle?.top,
    left: overlayStyle?.left
  },
  placementAttr: resolveDataPlacement(requestedPlacement, resolvedPlacement)
})

// chassis-css's `.combobox + .menu` sibling-selector rule (`_combobox.scss`) sets
// `--menu-max-height`/`--menu-overflow-y` from `$combobox-menu-max-height`/
// `$combobox-menu-overflow-y` (320px/auto by default) — but only while the panel is an adjacent
// DOM sibling of `.combobox`. `Autocomplete`/`Combobox` portal their panel to `document.body` (or
// an enclosing open `<dialog>`, via `useFloatingOverlay`), breaking that adjacency, so both inline
// this as a fallback matching the shipped Sass defaults instead of the generic, uncapped `.menu`
// fallback (`max-height: none`). A consumer who customized either Sass variable needs to
// re-override `--menu-max-height`/`--menu-overflow-y` on `.menu` directly, since the
// sibling-selector auto-application can no longer reach a portaled panel.
export const COMBOBOX_MENU_OVERLAY_STYLE: CSSProperties = {
  '--menu-max-height': '320px',
  '--menu-overflow-y': 'auto'
} as CSSProperties

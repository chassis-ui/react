import { CSSProperties } from 'react'
import { PlacementAxis } from 'react-aria'

import { Placement, resolveDataPlacement } from '../../utils/overlayPlacement'

// Shared between `Menu` and `MenuSubmenu`, whose floating panels both position via
// `useOverlayPosition` the same way: only `position`/`top`/`left` are taken from the hook's
// computed style (`zIndex`/`maxHeight` stay owned by chassis-css's own `--zindex`/`--max-height`
// tokens, see `_menu.scss`), and `data-cx-placement` needs the resolved main axis reattached to
// the originally-requested cross-axis alignment.
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

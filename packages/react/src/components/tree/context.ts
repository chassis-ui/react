import { createContext } from 'react'

import { IconValue } from '../../utils/iconConfig'

// What a `Tree` tells its items: whether a selectable item draws a checkbox, and the chevron to
// draw. Private to this folder: an item reads it, nothing outside the tree does.
export interface TreeConfig {
  checkboxes: boolean
  expandIcon?: IconValue
}

export const TreeConfigContext = createContext<TreeConfig>({ checkboxes: false })

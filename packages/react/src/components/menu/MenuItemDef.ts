import { ReactNode } from 'react'
import { Key } from 'react-stately'

export interface MenuItemDef {
  /**
   * Discriminates this entry from `MenuHeaderDef`/`MenuDividerDef` in a `MenuItemsDef`
   * array. Omit for a normal item — it's the default.
   */
  type?: 'item'
  /**
   * React key for this item.
   */
  id: Key
  /**
   * Label content for the item.
   */
  label: ReactNode
  /**
   * Text used for filtering/typeahead. Required when `label` isn't a plain string — components
   * that filter (e.g. `Combobox`, `Autocomplete`) can't derive it from rich content.
   */
  textValue?: string
  /**
   * URL for the item, when it acts as a link.
   */
  href?: string
  /**
   * Callback fired when the item is activated.
   */
  onClick?: () => void
  /**
   * Marks the item as disabled — it can't be clicked or reached via the keyboard.
   */
  disabled?: boolean
  /**
   * Marks the item as the current selection in a choice list.
   */
  selected?: boolean
  /**
   * Icon rendered at the item's leading edge (`.menu-item-icon`).
   */
  icon?: ReactNode
  /**
   * Secondary line of text rendered below the label (`.menu-item-description`).
   */
  description?: ReactNode
}

export interface MenuHeaderDef {
  /**
   * Discriminates this entry as a non-interactive group header.
   */
  type: 'header'
  /**
   * React key for this entry.
   */
  id: Key
  /**
   * Header content.
   */
  label: ReactNode
}

export interface MenuDividerDef {
  /**
   * Discriminates this entry as a divider.
   */
  type: 'divider'
  /**
   * React key for this entry.
   */
  id: Key
}

/**
 * A flat array of item/header/divider definitions for data-driven rendering — headers and
 * dividers are interleaved with items in authoring order, matching how chassis-css itself
 * renders grouped items (flat DOM siblings under `.menu`, no wrapping element per group).
 *
 * Covers flat items, headers, and dividers only — nested/recursive submenus aren't
 * representable here. Compose with `children`/`MenuSubmenu` directly for those.
 */
export type MenuItemsDef = (MenuItemDef | MenuHeaderDef | MenuDividerDef)[]

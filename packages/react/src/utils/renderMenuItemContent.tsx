import React, { ReactNode } from 'react'

import { Icon } from '../components/icon/Icon'

export interface MenuItemContentDef {
  /**
   * Icon rendered at the item's leading edge (`.menu-item-icon`).
   */
  icon?: ReactNode
  /**
   * Label content.
   */
  label: ReactNode
  /**
   * Secondary line of text rendered below the label (`.menu-item-description`).
   */
  description?: ReactNode
  /**
   * Renders a `.menu-item-check` at the trailing edge when true.
   */
  selected?: boolean
  /**
   * Icon name for the selected-state check. Defaults to chassis-css's own doc example.
   */
  checkIcon?: string
}

// Chassis-css defines identical markup for rich item content in both Menu and Combobox items
// (and, by extension, Autocomplete) — `.menu-item-icon` / `.menu-item-content` (label +
// `.menu-item-description`) / `.menu-item-check`. Shared here so every consumer produces
// byte-identical DOM instead of three near-duplicate implementations. Lives in `utils/` rather
// than `components/menu/` because it crosses that folder boundary — Combobox.tsx and
// Autocomplete.tsx both import it too. Renders bare `label` when there's nothing else to show,
// keeping simple items' markup as minimal as chassis-css's own simplest example.
export const renderMenuItemContent = ({
  icon,
  label,
  description,
  selected,
  checkIcon = 'check-solid'
}: MenuItemContentDef): ReactNode => {
  if (icon == null && description == null && !selected) return label

  return (
    <>
      {icon != null && (
        <span className="menu-item-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {description != null ? (
        <span className="menu-item-content">
          <span>{label}</span>
          <small className="menu-item-description">{description}</small>
        </span>
      ) : (
        label
      )}
      {selected && <Icon name={checkIcon} className="menu-item-check" />}
    </>
  )
}

import React, { ReactNode, useMemo } from 'react'

import { useIconConfig } from '../../hooks/useIconConfig'
import { IconConfig, IconContext } from '../../utils/iconConfig'

export interface IconProviderProps extends IconConfig {
  /**
   * The part of the app these icon settings apply to.
   */
  children?: ReactNode
}

// Nested providers extend the one above them: a setting left unset here keeps the outer value,
// and `icons` merges per key, so an inner provider can remap one icon without restating the rest.
export const IconProvider = ({
  children,
  className,
  component,
  font,
  fontPrefix,
  icons,
  sprite
}: IconProviderProps) => {
  const parent = useIconConfig()
  const value = useMemo<IconConfig>(
    () => ({
      className: className ?? parent.className,
      component: component ?? parent.component,
      font: font ?? parent.font,
      fontPrefix: fontPrefix ?? parent.fontPrefix,
      icons: icons ? { ...parent.icons, ...icons } : parent.icons,
      sprite: sprite ?? parent.sprite
    }),
    [parent, className, component, font, fontPrefix, icons, sprite]
  )

  return <IconContext.Provider value={value}>{children}</IconContext.Provider>
}

IconProvider.displayName = 'IconProvider'

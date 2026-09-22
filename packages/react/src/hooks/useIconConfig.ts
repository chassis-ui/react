import { useContext } from 'react'

import { IconConfig, IconContext } from '../utils/iconConfig'

// The nearest `IconProvider`'s settings, merged with every provider above it; empty outside one.
export const useIconConfig = (): IconConfig => useContext(IconContext)

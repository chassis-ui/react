import React, { FC } from 'react'
import PropTypes from 'prop-types'
import { SidebarNav } from '.'
import items from './../nav'

interface SidebarProps {
  currentRoute: string
}

const Sidebar: FC<SidebarProps> = ({ currentRoute }) => {
  return <SidebarNav items={items} currentRoute={currentRoute} />
}

Sidebar.propTypes = {
  currentRoute: PropTypes.string.isRequired,
}

Sidebar.displayName = 'Sidebar'

export default Sidebar

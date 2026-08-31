import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Menu } from '../../src/components/menu/Menu'
import { MenuToggle } from '../../src/components/menu/MenuToggle'
import { MenuList } from '../../src/components/menu/MenuList'
import { MenuItem } from '../../src/components/menu/MenuItem'
import { MenuDivider } from '../../src/components/menu/MenuDivider'
import { MenuHeader } from '../../src/components/menu/MenuHeader'

const meta: Meta<typeof Menu> = {
  component: Menu,
  title: 'menu/Menu'
}
export default meta

type Story = StoryObj<typeof Menu>

export const Closed: Story = {
  args: {
    children: (
      <>
        <MenuToggle color="secondary">Toggle menu</MenuToggle>
        <MenuList>
          <MenuItem href="#">Action</MenuItem>
          <MenuItem href="#">Another action</MenuItem>
          <MenuDivider />
          <MenuItem href="#">Something else here</MenuItem>
        </MenuList>
      </>
    )
  }
}

// `visible` renders the menu panel open on mount (synced by an effect, see Menu.tsx) — the only
// way to screenshot its content without driving a real click from the test. The menu panel
// portals to `document.body` (outside Storybook's `#storybook-root`), so the Playwright spec
// screenshots the whole iframe page for these stories rather than a specific element.
export const Open: Story = {
  args: {
    visible: true,
    children: (
      <>
        <MenuToggle color="secondary">Toggle menu</MenuToggle>
        <MenuList>
          <MenuItem href="#">Action</MenuItem>
          <MenuItem href="#">Another action</MenuItem>
          <MenuDivider />
          <MenuItem href="#">Something else here</MenuItem>
        </MenuList>
      </>
    )
  }
}

export const OpenWithHeader: Story = {
  args: {
    visible: true,
    children: (
      <>
        <MenuToggle color="secondary">Toggle menu</MenuToggle>
        <MenuList>
          <MenuItem href="#">Copy</MenuItem>
          <MenuItem href="#">Paste</MenuItem>
          <MenuHeader>Danger zone</MenuHeader>
          <MenuItem href="#">Delete all</MenuItem>
        </MenuList>
      </>
    )
  }
}

export const OpenSelectedItem: Story = {
  args: {
    visible: true,
    children: (
      <>
        <MenuToggle color="secondary">Sort by</MenuToggle>
        <MenuList>
          <MenuItem component="button" selected>
            Name
          </MenuItem>
          <MenuItem component="button">Date modified</MenuItem>
          <MenuItem component="button">Size</MenuItem>
        </MenuList>
      </>
    )
  }
}

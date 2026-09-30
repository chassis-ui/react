import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

import { ContextMenu } from '../../src/components/context-menu/ContextMenu'
import { MenuDivider } from '../../src/components/menu/MenuDivider'
import { MenuHeader } from '../../src/components/menu/MenuHeader'
import { MenuItem } from '../../src/components/menu/MenuItem'
import { MenuList } from '../../src/components/menu/MenuList'
import { MenuSubmenu } from '../../src/components/menu/MenuSubmenu'

const meta: Meta<typeof ContextMenu> = {
  component: ContextMenu,
  title: 'context-menu/ContextMenu'
}

export default meta

type Story = StoryObj<typeof ContextMenu>

const regionStyle: React.CSSProperties = {
  border: '2px dashed var(--cx-border-color)',
  borderRadius: 'var(--cx-border-radius)',
  padding: '3rem 1.5rem',
  textAlign: 'center'
}

const items = (
  <MenuList>
    <MenuItem>Cut</MenuItem>
    <MenuItem>Copy</MenuItem>
    <MenuItem>Paste</MenuItem>
    <MenuDivider />
    <MenuItem>Delete</MenuItem>
  </MenuList>
)

// A right-click at a point, checked in the three real browsers: the menu opens with its top-left
// corner at the pointer, its first item focused, and Escape closes it.
export const Default: Story = {
  args: {
    style: regionStyle,
    tabIndex: 0,
    children: (
      <>
        Right-click, long-press, or press Shift+F10 in this area.
        {items}
      </>
    )
  },
  play: async function ({ canvas, userEvent }) {
    const region = canvas.getByText(/Right-click/)
    const rect = region.getBoundingClientRect()
    const clientX = Math.round(rect.left + 40)
    const clientY = Math.round(rect.top + 30)
    await userEvent.pointer({ keys: '[MouseRight]', target: region, coords: { clientX, clientY } })

    const menu = document.querySelector<HTMLElement>('[role="menu"]')!
    await waitFor(() => expect(menu).toHaveClass('show'))
    await waitFor(() => expect(document.activeElement?.textContent).toBe('Cut'))
    const menuRect = menu.getBoundingClientRect()
    await expect(Math.round(menuRect.left)).toBe(clientX)
    await expect(Math.round(menuRect.top)).toBe(clientY)

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(menu).not.toHaveClass('show'))

    // The keyboard: Shift+F10 on the focused region opens the menu under the region.
    region.focus()
    await userEvent.keyboard('{Shift>}{F10}{/Shift}')
    await waitFor(() => expect(menu).toHaveClass('show'))
    await expect(Math.round(menu.getBoundingClientRect().top)).toBe(Math.round(rect.bottom))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(menu).not.toHaveClass('show'))
    await expect(region).toHaveFocus()

    // A finger held down opens the menu at the finger; a tap doesn't.
    await userEvent.pointer({ keys: '[TouchA>]', target: region, coords: { clientX, clientY } })
    await new Promise((resolve) => setTimeout(resolve, 200))
    await expect(menu).not.toHaveClass('show')
    await new Promise((resolve) => setTimeout(resolve, 400))
    await waitFor(() => expect(menu).toHaveClass('show'))
    await userEvent.pointer({ keys: '[/TouchA]' })
    await expect(menu).toHaveClass('show')
    await expect(Math.round(menu.getBoundingClientRect().left)).toBe(clientX)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(menu).not.toHaveClass('show'))
  }
}

// `defaultVisible` opens the menu on mount, with no pointer to place it at: it sits under the
// region's start edge. The list portals to `document.body`, so a screenshot of these stories
// takes the whole page.
export const Open: Story = {
  args: {
    defaultVisible: true,
    style: regionStyle,
    children: (
      <>
        The menu is open under this area.
        {items}
      </>
    )
  }
}

export const HeaderAndSubmenu: Story = {
  args: {
    defaultVisible: true,
    style: regionStyle,
    children: (
      <>
        Report.pdf
        <MenuList aria-label="Actions for Report.pdf">
          <MenuHeader>Report.pdf</MenuHeader>
          <MenuItem>Open</MenuItem>
          <MenuItem>Rename</MenuItem>
          <MenuSubmenu trigger="Share">
            <MenuItem>Copy link</MenuItem>
            <MenuItem>Send by mail</MenuItem>
          </MenuSubmenu>
          <MenuDivider />
          <MenuItem>Delete</MenuItem>
        </MenuList>
      </>
    )
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    style: regionStyle,
    children: (
      <>
        The browser's own menu opens here.
        {items}
      </>
    )
  }
}

export const Controlled: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <ContextMenu style={regionStyle} visible={visible} onVisibleChange={setVisible}>
          Right-click in this area.
          {items}
        </ContextMenu>
        <p className="form-text">The menu is {visible ? 'open' : 'closed'}.</p>
      </>
    )
  }
}

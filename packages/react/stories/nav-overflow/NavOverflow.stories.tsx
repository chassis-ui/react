import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

import { Nav } from '../../src/components/nav/Nav'
import { NavItem } from '../../src/components/nav/NavItem'
import { NavLink } from '../../src/components/nav/NavLink'
import { NavOverflow } from '../../src/components/nav-overflow/NavOverflow'
import { Navbar } from '../../src/components/navbar/Navbar'
import { NavbarBrand } from '../../src/components/navbar/NavbarBrand'
import { NavbarNav } from '../../src/components/navbar/NavbarNav'
import { Tab } from '../../src/components/tabs/Tab'
import { TabList } from '../../src/components/tabs/TabList'
import { TabPanel } from '../../src/components/tabs/TabPanel'
import { Tabs } from '../../src/components/tabs/Tabs'

const meta: Meta<typeof NavOverflow> = {
  component: NavOverflow,
  title: 'nav-overflow/NavOverflow'
}

export default meta

type Story = StoryObj<typeof NavOverflow>

const LABELS = ['Home', 'Dashboard', 'Products', 'Services', 'Analytics', 'Reports', 'Settings']

const items = (active = 'Home') =>
  LABELS.map((label) => (
    <NavItem key={label} href={`#${label.toLowerCase()}`} active={label === active}>
      {label}
    </NavItem>
  ))

// A fixed width, so what fits doesn't depend on the viewport the story is opened in.
const narrow = (width: number) => (Story: React.ComponentType) => (
  <div style={{ width }}>
    <Story />
  </div>
)

// Every item fits: the toggle item is in the list, hidden.
export const Default: Story = {
  decorators: [narrow(900)],
  render: (args) => (
    <NavOverflow {...args}>
      <Nav variant="pills">{items()}</Nav>
    </NavOverflow>
  ),
  play: async function ({ canvas }) {
    await expect(canvas.getAllByRole('link')).toHaveLength(LABELS.length)
    await expect(canvas.queryByRole('button', { name: 'More' })).not.toBeInTheDocument()
  }
}

export const Collapsed: Story = {
  decorators: [narrow(360)],
  render: Default.render,
  play: async function ({ canvas, userEvent }) {
    // The first items stay, the rest are in the menu, and nothing runs past the wrapper.
    const toggle = await canvas.findByRole('button', { name: 'More' })
    await expect(canvas.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(canvas.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument()
    const wrapper = toggle.closest('.nav-overflow') as HTMLElement
    const list = wrapper.querySelector('.nav') as HTMLElement
    await expect(list.scrollWidth).toBeLessThanOrEqual(wrapper.clientWidth)

    await userEvent.click(toggle)
    const menuItem = await canvas.findByRole('menuitem', { name: 'Settings' })
    await waitFor(() => expect(menuItem).toBeVisible())
    await expect(menuItem).toHaveAttribute('href', '#settings')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(toggle).toHaveAttribute('aria-expanded', 'false'))
  }
}

// The active item is never in the menu, wherever it is in the list.
export const ActiveItemStays: Story = {
  decorators: [narrow(360)],
  render: (args) => (
    <NavOverflow {...args}>
      <Nav variant="tabs">{items('Reports')}</Nav>
    </NavOverflow>
  ),
  play: async function ({ canvas }) {
    await canvas.findByRole('button', { name: 'More' })
    await expect(canvas.getByRole('link', { name: 'Reports' })).toBeVisible()
    await expect(canvas.queryByRole('link', { name: 'Analytics' })).not.toBeInTheDocument()
  }
}

export const KeepVisible: Story = {
  decorators: [narrow(360)],
  render: (args) => (
    <NavOverflow {...args}>
      <Nav variant="pills">
        {LABELS.map((label, index) => (
          <NavItem key={label} href="#" active={index === 0} keepVisible={label === 'Settings'}>
            {label}
          </NavItem>
        ))}
      </Nav>
    </NavOverflow>
  ),
  play: async function ({ canvas }) {
    await canvas.findByRole('button', { name: 'More' })
    await expect(canvas.getByRole('link', { name: 'Settings' })).toBeVisible()
  }
}

export const IconOnly: Story = {
  args: { moreLabel: 'More pages', moreText: false },
  decorators: [narrow(360)],
  render: Default.render,
  play: async function ({ canvas }) {
    await expect(await canvas.findByRole('button', { name: 'More pages' })).toBeVisible()
  }
}

export const CollapseBelow: Story = {
  args: { collapseBelow: 'sm', iconPlacement: 'end', moreText: 'Menu' },
  decorators: [narrow(480)],
  render: Default.render,
  play: async function ({ canvas }) {
    // Narrower than the breakpoint: everything but the active item is in the menu.
    await canvas.findByRole('button', { name: 'Menu' })
    await expect(canvas.getAllByRole('link')).toHaveLength(1)
  }
}

export const Threshold: Story = {
  args: { threshold: 3 },
  decorators: [narrow(200)],
  render: Default.render,
  play: async function ({ canvas }) {
    await canvas.findByRole('button', { name: 'More' })
    await expect(canvas.getAllByRole('link')).toHaveLength(3)
  }
}

export const InNavbar: Story = {
  decorators: [narrow(420)],
  render: (args) => (
    <Navbar expand aria-label="Main navigation">
      <NavbarBrand href="#">Brand</NavbarBrand>
      <NavOverflow {...args}>
        <NavbarNav>
          {LABELS.map((label, index) => (
            <NavItem key={label}>
              <NavLink href="#" active={index === 0}>
                {label}
              </NavLink>
            </NavItem>
          ))}
        </NavbarNav>
      </NavOverflow>
    </Navbar>
  ),
  play: async function ({ canvas }) {
    await canvas.findByRole('button', { name: 'More' })
    await expect(canvas.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(canvas.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument()
  }
}

export const WithTabs: Story = {
  decorators: [narrow(360)],
  render: (args) => (
    <Tabs defaultSelectedKey="Home">
      <NavOverflow {...args}>
        <TabList aria-label="Sections">
          {LABELS.map((label) => (
            <Tab key={label} id={label}>
              {label}
            </Tab>
          ))}
        </TabList>
      </NavOverflow>
      {LABELS.map((label) => (
        <TabPanel key={label} id={label}>
          {label} panel
        </TabPanel>
      ))}
    </Tabs>
  ),
  play: async function ({ canvas, canvasElement, userEvent }) {
    // The toggle is a stop among the tabs: the arrow keys reach it, and skip the hidden tabs.
    const toggle = await canvas.findByRole('tab', { name: 'More' })
    await expect(canvas.queryByRole('tab', { name: 'Settings' })).not.toBeInTheDocument()
    const shown = canvas.getAllByRole('tab').filter((tab) => tab !== toggle)
    await userEvent.click(canvas.getByRole('tab', { name: 'Home' }))
    await userEvent.keyboard('{End}')
    await expect(toggle).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(shown[shown.length - 1]).toHaveFocus()

    // A tab chosen in the menu is selected, back in the list, and focused.
    await userEvent.click(toggle)
    const page = canvasElement.ownerDocument.body
    const menuItem = await waitFor(() => {
      const item = Array.from(page.querySelectorAll('[role="menuitem"]')).find(
        (element) => element.textContent === 'Settings'
      )
      expect(item).toBeDefined()
      return item as HTMLElement
    })
    await waitFor(() => expect(menuItem).toBeVisible())
    await userEvent.click(menuItem)
    const settings = await canvas.findByRole('tab', { name: 'Settings' })
    await expect(settings).toHaveAttribute('aria-selected', 'true')
    await waitFor(() => expect(settings).toHaveFocus())
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Settings panel')
  }
}

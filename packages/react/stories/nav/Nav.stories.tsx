import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Nav } from '../../src/components/nav/Nav'
import { NavItem } from '../../src/components/nav/NavItem'
import { NavLink } from '../../src/components/nav/NavLink'

const meta: Meta<typeof Nav> = {
  component: Nav,
  title: 'nav/Nav'
}

export default meta

type Story = StoryObj<typeof Nav>

export const Default: Story = {
  render: () => (
    <Nav>
      <NavItem>
        <NavLink href="#" active>
          Active
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#">Link</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#">Link</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#" disabled>
          Disabled
        </NavLink>
      </NavItem>
    </Nav>
  )
}

export const DataDriven: Story = {
  args: {
    items: [
      { label: 'Home', href: '#', active: true },
      { label: 'Features', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Disabled', href: '#', disabled: true }
    ]
  }
}

export const Pills: Story = {
  render: () => (
    <Nav variant="pills">
      <NavItem>
        <NavLink href="#" active>
          Active
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#">Link</NavLink>
      </NavItem>
    </Nav>
  )
}

export const Vertical: Story = {
  render: () => (
    <Nav className="flex-column">
      <NavItem>
        <NavLink href="#" active>
          Active
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#">Link</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#">Link</NavLink>
      </NavItem>
    </Nav>
  )
}

export const Fill: Story = {
  render: () => (
    <Nav variant="pills" layout="fill">
      <NavItem>
        <NavLink href="#" active>
          Active
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#">Link</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#" disabled>
          Disabled
        </NavLink>
      </NavItem>
    </Nav>
  )
}

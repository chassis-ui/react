import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Nav } from '../../src/components/nav/Nav'
import { NavItem } from '../../src/components/nav/NavItem'
import { NavLink } from '../../src/components/nav/NavLink'
import { NavTitle } from '../../src/components/nav/NavTitle'

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

export const Segments: Story = {
  render: () => (
    <Nav variant="segments">
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

export const Underline: Story = {
  render: () => (
    <Nav variant="underline">
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

export const Sizes: Story = {
  render: () => (
    <div className="vstack gap-md align-items-start">
      {(['sm', undefined, 'lg'] as const).map((size) =>
        (['tabs', 'segments', 'underline'] as const).map((variant) => (
          <Nav key={`${variant}-${size}`} size={size} variant={variant}>
            <NavItem>
              <NavLink href="#" active>
                Active
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Link</NavLink>
            </NavItem>
          </Nav>
        ))
      )}
    </div>
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
    <Nav variant="segments" layout="fill">
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

// A `NavTitle` heads a group of links, as a plain list item among them.
export const WithTitle: Story = {
  render: () => (
    <Nav className="flex-column">
      <NavTitle>Account</NavTitle>
      <NavItem>
        <NavLink href="#" active>
          Profile
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#">Billing</NavLink>
      </NavItem>
      <NavTitle>Workspace</NavTitle>
      <NavItem>
        <NavLink href="#">Members</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#">Settings</NavLink>
      </NavItem>
    </Nav>
  ),
  play: async function ({ canvas }) {
    const title = canvas.getByText('Account')
    await expect(title).toHaveClass('nav-title')
    await expect(canvas.getAllByRole('listitem')).toHaveLength(6)
    await expect(canvas.getAllByRole('link')).toHaveLength(4)
  }
}

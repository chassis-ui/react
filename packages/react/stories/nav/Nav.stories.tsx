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

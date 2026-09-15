import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '../../src/components/badge/Badge'
import { Button } from '../../src/components/button/Button'

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: 'badge/Badge'
}

export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    color: 'primary',
    children: 'Primary'
  }
}

export const Colors: Story = {
  render: () => (
    <>
      <Badge color="default">Default</Badge>
      <Badge color="primary">Primary</Badge>
      <Badge color="secondary">Secondary</Badge>
      <Badge color="danger">Danger</Badge>
      <Badge color="success">Success</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="info">Info</Badge>
    </>
  )
}

export const Outline: Story = {
  render: () => (
    <>
      <Badge color="primary" variant="outline">
        Primary
      </Badge>
      <Badge color="danger" variant="outline">
        Danger
      </Badge>
      <Badge color="success" variant="outline">
        Success
      </Badge>
    </>
  )
}

export const Smooth: Story = {
  render: () => (
    <>
      <Badge color="primary" variant="smooth">
        Primary
      </Badge>
      <Badge color="danger" variant="smooth">
        Danger
      </Badge>
      <Badge color="success" variant="smooth">
        Success
      </Badge>
    </>
  )
}

export const ButtonCounter: Story = {
  render: () => (
    <Button color="primary">
      Notifications <Badge color="secondary">4</Badge>
    </Button>
  )
}

export const Positioned: Story = {
  render: () => (
    <Button color="primary" className="position-relative">
      Profile
      <Badge color="danger" position="top-end" circle>
        99+ <span className="visually-hidden">unread messages</span>
      </Badge>
    </Button>
  )
}

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Icon } from '../../src/components/icon/Icon'
import { Link } from '../../src/components/link/Link'

const meta: Meta<typeof Link> = {
  component: Link,
  title: 'link/Link'
}

export default meta

type Story = StoryObj<typeof Link>

export const Default: Story = {
  args: {
    href: '#',
    children: 'Default link'
  }
}

export const Colors: Story = {
  render: () => (
    <>
      <Link href="#" color="primary">
        primary link
      </Link>
      <Link href="#" color="danger">
        danger link
      </Link>
      <Link href="#" color="success">
        success link
      </Link>
    </>
  )
}

export const Active: Story = {
  args: {
    href: '#',
    active: true,
    children: 'Current page'
  }
}

export const Disabled: Story = {
  args: {
    href: '#',
    disabled: true,
    children: 'Disabled link'
  }
}

export const AsButton: Story = {
  args: {
    component: 'button',
    type: 'button',
    onClick: fn(),
    children: 'Button'
  },
  play: async function ({ args, canvas, userEvent }) {
    const button = canvas.getByRole('button', { name: 'Button' })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalled()
  }
}

export const IconLink: Story = {
  render: () => (
    <Link href="#" iconLink>
      <Icon name="info-circle-solid" aria-hidden="true" />
      Icon link
    </Link>
  )
}

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Icon } from '../../src/components/icon/Icon'

const meta: Meta<typeof Icon> = {
  component: Icon,
  title: 'icon/Icon'
}

export default meta

type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: {
    name: 'check-solid'
  }
}

export const AccessibleName: Story = {
  args: {
    name: 'exclamation-triangle-solid',
    title: 'Warning'
  }
}

export const Sizes: Story = {
  render: () => (
    <>
      <Icon name="check-solid" size={16} />
      <Icon name="check-solid" size={24} />
      <Icon name="check-solid" size={32} />
      <Icon name="check-solid" size={48} />
    </>
  )
}

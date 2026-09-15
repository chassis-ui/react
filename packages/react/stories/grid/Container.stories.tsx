import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Container } from '../../src/components/grid/Container'

const meta: Meta<typeof Container> = {
  component: Container,
  title: 'grid/Container',
  argTypes: {
    fluidUntil: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl']
    }
  }
}
export default meta

type Story = StoryObj<typeof Container>

const content = <div className="border p-md text-center">Responsive container content</div>

export const Default: Story = {
  args: {
    children: content
  }
}

export const Fluid: Story = {
  args: {
    fluid: true,
    children: content
  }
}

export const FluidUntil: Story = {
  args: {
    fluidUntil: 'md',
    children: content
  }
}

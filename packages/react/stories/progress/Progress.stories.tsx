import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Progress } from '../../src/components/progress/Progress'

const meta: Meta<typeof Progress> = {
  component: Progress,
  title: 'progress/Progress'
}

export default meta

type Story = StoryObj<typeof Progress>

export const Default: Story = {
  args: {
    'aria-label': 'Basic example',
    value: 25
  }
}

export const Colors: Story = {
  render: () => (
    <>
      <Progress aria-label="Basic example" value={25} />
      <Progress aria-label="Success example" color="success" value={25} />
      <Progress aria-label="Info example" color="info" value={50} />
      <Progress aria-label="Warning example" color="warning" value={75} />
      <Progress aria-label="Danger example" color="danger" value={100} />
    </>
  )
}

export const Striped: Story = {
  render: () => (
    <>
      <Progress aria-label="Basic striped example" striped value={25} />
      <Progress aria-label="Success striped example" color="success" striped value={50} />
    </>
  )
}

export const Animated: Story = {
  args: {
    'aria-label': 'Animated example',
    animated: true,
    striped: true,
    value: 50
  }
}

export const Height: Story = {
  render: () => (
    <>
      <Progress aria-label="1px high example" height={1} value={25} />
      <Progress aria-label="20px high example" height={20} value={25} />
    </>
  )
}

export const InlineValue: Story = {
  args: {
    'aria-label': 'Example with value',
    inlineValue: true,
    value: 25
  }
}

export const WithLabel: Story = {
  args: {
    label: 'Progress',
    showValue: true,
    inlineValue: true,
    value: 65
  }
}

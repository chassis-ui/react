import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Stepper } from '../../src/components/stepper/Stepper'
import { StepperItem } from '../../src/components/stepper/StepperItem'

const meta: Meta<typeof Stepper> = {
  component: Stepper,
  title: 'stepper/Stepper'
}
export default meta

type Story = StoryObj<typeof Stepper>

const items = (
  <>
    <StepperItem>First Step</StepperItem>
    <StepperItem>Past Step</StepperItem>
    <StepperItem active>Current Step</StepperItem>
    <StepperItem>Next Step</StepperItem>
    <StepperItem>Last Step</StepperItem>
  </>
)

export const Vertical: Story = {
  args: {
    children: items
  }
}

export const Horizontal: Story = {
  args: {
    layout: 'horizontal',
    children: items
  }
}

export const IconStepper: Story = {
  args: {
    layout: 'horizontal',
    icon: true,
    children: items
  }
}

export const Context: Story = {
  args: {
    layout: 'horizontal',
    color: 'secondary',
    children: items
  }
}

// Past steps link back with `href`, and `Stepper` renders a `<div>` in place of the `<ol>`.
export const Linked: Story = {
  args: {
    layout: 'horizontal',
    children: (
      <>
        <StepperItem href="#">First Step</StepperItem>
        <StepperItem href="#">Past Step</StepperItem>
        <StepperItem active>Current Step</StepperItem>
        <StepperItem>Next Step</StepperItem>
      </>
    )
  }
}

export const DataDriven: Story = {
  args: {
    layout: 'horizontal',
    items: [
      { label: 'First Step' },
      { label: 'Past Step' },
      { label: 'Current Step', active: true },
      { label: 'Next Step' },
      { label: 'Last Step' }
    ]
  }
}

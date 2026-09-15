import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Radio } from '../../src/components/radio/Radio'
import { RadioGroup } from '../../src/components/radio/RadioGroup'

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  title: 'radio/Radio'
}

export default meta

type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup label="Choose an option" defaultValue="default">
      <Radio value="default" label="Default radio" />
      <Radio value="checked" label="Checked radio" />
    </RadioGroup>
  ),
  play: async function ({ canvas, userEvent }) {
    const checkedRadio = canvas.getByRole('radio', { name: 'Checked radio' })
    await userEvent.click(checkedRadio)
    await expect(checkedRadio).toBeChecked()
  }
}

export const ToggleButtons: Story = {
  render: () => (
    <RadioGroup aria-label="Radio toggle buttons" defaultValue="checked" orientation="horizontal">
      <Radio button={{ color: 'secondary' }} value="checked" autoComplete="off" label="Checked" />
      <Radio button={{ color: 'secondary' }} value="radio" autoComplete="off" label="Radio" />
      <Radio
        button={{ color: 'secondary' }}
        value="disabled"
        autoComplete="off"
        label="Radio"
        disabled
      />
    </RadioGroup>
  )
}

export const Validation: Story = {
  render: () => (
    <RadioGroup label="Select a plan" invalid errorMessage="Please choose a plan to continue.">
      <Radio value="basic" label="Basic" />
      <Radio value="pro" label="Pro" />
    </RadioGroup>
  )
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup label="Choose an option" defaultValue="checked">
      <Radio value="default" label="Disabled radio" disabled />
      <Radio value="checked" label="Disabled checked radio" disabled />
    </RadioGroup>
  )
}

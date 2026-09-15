import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Checkbox } from '../../src/components/checkbox/Checkbox'
import { CheckboxGroup } from '../../src/components/checkbox/CheckboxGroup'

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: 'checkbox/Checkbox'
}

export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    id: 'flexCheckDefault',
    label: 'Default checkbox',
    onChange: fn()
  },
  play: async function ({ args, canvas, userEvent }) {
    const checkbox = canvas.getByRole('checkbox', { name: 'Default checkbox' })
    await userEvent.click(checkbox)
    await expect(args.onChange).toHaveBeenCalledWith(true)
    await expect(checkbox).toBeChecked()
  }
}

export const Sizes: Story = {
  render: () => (
    <>
      <Checkbox size="lg" id="checkLarge" label="Large checkbox" />
      <Checkbox id="checkMedium" label="Default checkbox" />
      <Checkbox size="sm" id="checkSmall" label="Small checkbox" />
    </>
  )
}

export const Indeterminate: Story = {
  args: {
    id: 'flexCheckIndeterminate',
    label: 'Indeterminate checkbox',
    indeterminate: true
  }
}

export const ToggleButton: Story = {
  args: {
    id: 'button-check',
    label: 'Single toggle',
    autoComplete: 'off',
    button: { color: 'primary' }
  }
}

export const Disabled: Story = {
  render: () => (
    <>
      <Checkbox label="Disabled checkbox" disabled />
      <Checkbox label="Disabled checked checkbox" defaultSelected disabled />
    </>
  )
}

export const Group: Story = {
  render: () => (
    <CheckboxGroup
      label="Notifications"
      description="Choose which notifications you'd like to receive."
      defaultValue={['email']}
    >
      <Checkbox value="email" label="Email" />
      <Checkbox value="sms" label="SMS" />
      <Checkbox value="push" label="Push" />
    </CheckboxGroup>
  )
}

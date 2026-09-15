import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Switch } from '../../src/components/switch/Switch'

const meta: Meta<typeof Switch> = {
  component: Switch,
  title: 'switch/Switch'
}

export default meta

type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {
    id: 'formSwitchCheckDefault',
    label: 'Default switch checkbox input',
    onChange: fn()
  },
  play: async function ({ args, canvas, userEvent }) {
    const toggle = canvas.getByRole('switch', { name: /default switch/i })
    await userEvent.click(toggle)
    await expect(args.onChange).toHaveBeenCalledWith(true)
    await expect(toggle).toBeChecked()
  }
}

export const Checked: Story = {
  args: {
    id: 'formSwitchCheckChecked',
    label: 'Checked switch checkbox input',
    defaultSelected: true
  }
}

export const Sizes: Story = {
  render: () => (
    <>
      <Switch size="sm" label="Small switch checkbox input" id="formSwitchCheckDefaultSm" />
      <Switch label="Default switch checkbox input" id="formSwitchCheckDefault2" />
      <Switch size="lg" label="Large switch checkbox input" id="formSwitchCheckDefaultLg" />
    </>
  )
}

export const Disabled: Story = {
  render: () => (
    <>
      <Switch label="Disabled switch checkbox input" id="formSwitchCheckDisabled" disabled />
      <Switch
        label="Disabled checked switch checkbox input"
        id="formSwitchCheckCheckedDisabled"
        defaultSelected
        disabled
      />
    </>
  )
}

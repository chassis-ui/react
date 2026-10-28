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

// `type="radio"`: one switch of a `name` on at a time. A click turns another on, and leaves the one
// that is on, as a radio group's does; the browser puts back the click it is denied.
export const RadioType: Story = {
  render: () => (
    <form aria-label="Theme">
      <Switch defaultSelected label="Light" name="theme" type="radio" value="light" />
      <Switch label="Dark" name="theme" type="radio" value="dark" />
    </form>
  ),
  play: async function ({ canvas, userEvent }) {
    const light = canvas.getByRole('switch', { name: 'Light' })
    const dark = canvas.getByRole('switch', { name: 'Dark' })
    await userEvent.click(light)
    await expect(light).toBeChecked()
    await userEvent.click(dark)
    await expect(dark).toBeChecked()
    await expect(light).not.toBeChecked()
    await userEvent.keyboard(' ')
    await expect(dark).toBeChecked()
    await userEvent.click(light)
    await expect(light).toBeChecked()
    await expect(dark).not.toBeChecked()
  }
}

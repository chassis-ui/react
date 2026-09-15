import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { ColorInput } from '../../src/components/color-input/ColorInput'
import { FormLabel } from '../../src/components/form/FormLabel'

const meta: Meta<typeof ColorInput> = {
  component: ColorInput,
  title: 'color-input/ColorInput'
}

export default meta

type Story = StoryObj<typeof ColorInput>

export const Default: Story = {
  render: (args) => (
    <>
      <FormLabel htmlFor="exampleColorInput">Color picker</FormLabel>
      <ColorInput id="exampleColorInput" defaultValue="#0d6efd" {...args} />
    </>
  ),
  args: {
    onChange: fn()
  },
  play: async function ({ canvas }) {
    const input = canvas.getByLabelText('Color picker')
    await expect(input).toHaveValue('#0d6efd')
  }
}

export const Sizes: Story = {
  render: () => (
    <>
      <FormLabel htmlFor="colorInputSm">Small color input</FormLabel>
      <ColorInput id="colorInputSm" size="sm" className="mb-md" />
      <FormLabel htmlFor="colorInputLg">Large color input</FormLabel>
      <ColorInput id="colorInputLg" size="lg" />
    </>
  )
}

export const WithFormField: Story = {
  args: {
    label: 'Accent color',
    help: 'Used for links and primary buttons.',
    defaultValue: '#0d6efd',
    id: 'accentColor'
  }
}

export const Disabled: Story = {
  render: () => (
    <>
      <FormLabel htmlFor="exampleColorInputDisabled">Disabled color picker</FormLabel>
      <ColorInput id="exampleColorInputDisabled" defaultValue="#0d6efd" disabled />
    </>
  )
}

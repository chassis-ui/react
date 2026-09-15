import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn } from 'storybook/test'

import { FormLabel } from '../../src/components/form/FormLabel'
import { RangeInput } from '../../src/components/range-input/RangeInput'

const meta: Meta<typeof RangeInput> = {
  component: RangeInput,
  title: 'range-input/RangeInput'
}

export default meta

type Story = StoryObj<typeof RangeInput>

export const Default: Story = {
  render: (args) => (
    <>
      <FormLabel htmlFor="customRange1">Example range</FormLabel>
      <RangeInput id="customRange1" {...args} />
    </>
  ),
  args: {
    onChange: fn()
  },
  play: async function ({ args, canvas }) {
    const range = canvas.getByRole('slider', { name: /example range/i })
    fireEvent.change(range, { target: { value: '75' } })
    await expect(args.onChange).toHaveBeenCalled()
  }
}

export const MinMax: Story = {
  render: () => (
    <>
      <FormLabel htmlFor="customRange2">Example range</FormLabel>
      <RangeInput min={0} max={5} defaultValue="3" id="customRange2" />
    </>
  )
}

export const Steps: Story = {
  render: () => (
    <>
      <FormLabel htmlFor="customRange3">Example range</FormLabel>
      <RangeInput min={0} max={5} step={0.5} defaultValue="3" id="customRange3" />
    </>
  )
}

export const Disabled: Story = {
  render: () => (
    <>
      <FormLabel htmlFor="disabledRange">Disabled range</FormLabel>
      <RangeInput id="disabledRange" disabled />
    </>
  )
}

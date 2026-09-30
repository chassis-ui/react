import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { InputAdorn } from '../../src/components/input-adorn/InputAdorn'
import { NumberField } from '../../src/components/number-field/NumberField'

const meta: Meta<typeof NumberField> = {
  component: NumberField,
  title: 'number-field/NumberField'
}

export default meta

type Story = StoryObj<typeof NumberField>

export const Default: Story = {
  args: {
    defaultValue: 1,
    label: 'Quantity',
    onChange: fn()
  },
  play: async function ({ args, canvas, userEvent }) {
    const input = canvas.getByRole('textbox', { name: 'Quantity' })
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Quantity' }))
    await expect(input).toHaveValue('2')
    await expect(args.onChange).toHaveBeenLastCalledWith(2)
    // A pointer press leaves focus on the input, where the arrow keys step on.
    await expect(input).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await expect(input).toHaveValue('0')
  }
}

export const MinMaxStep: Story = {
  args: {
    defaultValue: 10,
    help: 'From 0 to 10, in steps of 2.',
    label: 'Seats',
    max: 10,
    min: 0,
    step: 2
  },
  // At `max` the increment button is disabled, and the field doesn't look disabled for it.
  play: async function ({ canvas }) {
    const increase = canvas.getByRole('button', { name: 'Increase Seats' })
    await expect(increase).toBeDisabled()
    const field = canvas.getByRole('textbox', { name: 'Seats' }).parentElement as HTMLElement
    await expect(getComputedStyle(field).backgroundColor).toBe(
      getComputedStyle(canvas.getByTestId('enabled-reference')).backgroundColor
    )
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <input
          aria-label="Reference"
          className="form-input d-none"
          data-testid="enabled-reference"
        />
      </>
    )
  ]
}

export const Formatted: Story = {
  render: () => (
    <div className="vstack gap-md" style={{ maxWidth: '20rem' }}>
      <NumberField
        defaultValue={1250.5}
        formatOptions={{ currency: 'EUR', style: 'currency' }}
        label="Price"
      />
      <NumberField
        defaultValue={0.15}
        formatOptions={{ style: 'percent' }}
        label="Discount"
        step={0.01}
      />
      <NumberField
        defaultValue={72}
        formatOptions={{ style: 'unit', unit: 'kilogram' }}
        label="Weight"
      />
    </div>
  )
}

export const Sizes: Story = {
  render: () => (
    <div className="vstack gap-md" style={{ maxWidth: '20rem' }}>
      <NumberField aria-label="Small" defaultValue={1} size="sm" />
      <NumberField aria-label="Medium" defaultValue={1} />
      <NumberField aria-label="Large" defaultValue={1} size="lg" />
    </div>
  )
}

export const States: Story = {
  render: () => (
    <div className="vstack gap-md" style={{ maxWidth: '20rem' }}>
      <NumberField defaultValue={3} disabled label="Disabled" />
      <NumberField defaultValue={3} label="Read only" readOnly />
      <NumberField defaultValue={120} invalid invalidFeedback="At most 100." label="Invalid" />
      <NumberField defaultValue={42} label="Valid" valid validFeedback="Looks good." />
    </div>
  )
}

export const AdornsAndNoButtons: Story = {
  render: () => (
    <div className="vstack gap-md" style={{ maxWidth: '20rem' }}>
      <NumberField adornEnd={<InputAdorn>cm</InputAdorn>} defaultValue={180} label="Height" />
      <NumberField defaultValue={2026} label="Year" stepButtons={false} />
    </div>
  )
}

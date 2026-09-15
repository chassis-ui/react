import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Select } from '../../src/components/select/Select'

const meta: Meta<typeof Select> = {
  component: Select,
  title: 'select/Select'
}

export default meta

type Story = StoryObj<typeof Select>

const options = [
  { label: 'One', value: '1' },
  { label: 'Two', value: '2' },
  { label: 'Three', value: '3', disabled: true }
]

export const Default: Story = {
  args: {
    'aria-label': 'Basic select',
    placeholder: 'Choose an option',
    options,
    onChange: fn()
  },
  play: async function ({ args, canvas, userEvent }) {
    const select = canvas.getByRole('combobox', { name: /basic select/i })
    await userEvent.selectOptions(select, '2')
    await expect(args.onChange).toHaveBeenCalled()
    await expect(select).toHaveValue('2')
  }
}

export const Sizes: Story = {
  render: () => (
    <>
      <Select size="lg" aria-label="Large select" options={options} />
      <Select aria-label="Default select" options={options} />
      <Select size="sm" aria-label="Small select" options={options} />
    </>
  )
}

export const Multiple: Story = {
  args: {
    'aria-label': 'Multiple select',
    multiple: true,
    options: [
      { label: 'One', value: '1' },
      { label: 'Two', value: '2', selected: true },
      { label: 'Three', value: '3', selected: true }
    ]
  }
}

export const WithFormField: Story = {
  args: {
    label: 'Country',
    help: 'Used to calculate shipping costs.',
    options: [
      { label: 'Australia', value: 'au' },
      { label: 'Canada', value: 'ca' },
      { label: 'United Kingdom', value: 'gb' },
      { label: 'United States', value: 'us' }
    ]
  }
}

export const Invalid: Story = {
  args: {
    label: 'Country',
    invalid: true,
    invalidFeedback: 'Please choose a country.',
    placeholder: 'Choose a country',
    options: [
      { label: 'Australia', value: 'au' },
      { label: 'Canada', value: 'ca' }
    ]
  }
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Disabled select',
    placeholder: 'Choose an option',
    options,
    disabled: true
  }
}

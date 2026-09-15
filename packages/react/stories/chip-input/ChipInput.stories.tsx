import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { ChipInput } from '../../src/components/chip-input/ChipInput'

const meta: Meta<typeof ChipInput> = {
  component: ChipInput,
  title: 'chip-input/ChipInput'
}

export default meta

type Story = StoryObj<typeof ChipInput>

export const Default: Story = {
  args: {
    'aria-label': 'Skills',
    defaultValue: ['React', 'TypeScript'],
    placeholder: 'Add skill…',
    chipVariant: 'primary smooth',
    onChange: fn()
  },
  play: async function ({ args, canvas, userEvent }) {
    const input = canvas.getByRole('textbox', { name: /skills/i })
    await userEvent.type(input, 'CSS{enter}')
    await expect(args.onChange).toHaveBeenCalledWith(['React', 'TypeScript', 'CSS'])
  }
}

export const Variants: Story = {
  render: () => (
    <div className="vstack gap-md">
      <ChipInput
        aria-label="Status"
        chipVariant="primary"
        defaultValue={['Approved', 'Verified']}
        placeholder="Add status…"
      />
      <ChipInput
        aria-label="Issue labels"
        chipVariant="danger smooth"
        defaultValue={['Bug', 'Critical']}
        placeholder="Add label…"
      />
    </div>
  )
}

export const WithFormField: Story = {
  args: {
    label: 'Skills',
    help: 'Press Enter or , to add a skill.',
    defaultValue: ['React', 'CSS'],
    name: 'skills',
    placeholder: 'Add skill…'
  }
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Skills',
    defaultValue: ['React', 'CSS'],
    disabled: true
  }
}

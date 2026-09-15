import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Icon } from '../../src/components/icon/Icon'
import { InputAdorn } from '../../src/components/input-adorn/InputAdorn'
import { TextInput } from '../../src/components/text-input/TextInput'

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: 'text-input/TextInput'
}

export default meta

type Story = StoryObj<typeof TextInput>

export const Default: Story = {
  args: {
    'aria-label': 'Example text input',
    placeholder: 'Example text input',
    onChange: fn()
  },
  play: async function ({ args, canvas, userEvent }) {
    const input = canvas.getByRole('textbox', { name: /example text input/i })
    await userEvent.type(input, 'Hello')
    await expect(args.onChange).toHaveBeenCalled()
    await expect(input).toHaveValue('Hello')
  }
}

export const Adorns: Story = {
  render: () => (
    <>
      <TextInput
        aria-label="Search"
        placeholder="Search..."
        adornStart={
          <InputAdorn>
            <Icon name="search-outline" size={16} />
          </InputAdorn>
        }
      />
      <TextInput
        aria-label="Amount in dollars"
        placeholder="0.00"
        adornStart={<InputAdorn>$</InputAdorn>}
        adornEnd={<InputAdorn>USD</InputAdorn>}
      />
    </>
  )
}

export const WithFormField: Story = {
  args: {
    label: 'Name',
    help: 'Enter your full name'
  }
}

export const Invalid: Story = {
  args: {
    label: 'Email address',
    invalid: true,
    invalidFeedback: 'Please enter a valid email address.'
  }
}

export const Readonly: Story = {
  render: () => (
    <>
      <TextInput defaultValue="Readonly input" aria-label="Readonly input example" readOnly />
      <TextInput
        defaultValue="Readonly disabled input"
        aria-label="Readonly disabled input example"
        readOnly
        disabled
      />
    </>
  )
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Disabled text input',
    placeholder: 'Disabled input',
    disabled: true
  }
}

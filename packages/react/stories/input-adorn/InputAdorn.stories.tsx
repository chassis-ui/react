import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Icon } from '../../src/components/icon/Icon'
import { InputAdorn } from '../../src/components/input-adorn/InputAdorn'
import { TextInput } from '../../src/components/text-input/TextInput'

const meta: Meta<typeof InputAdorn> = {
  component: InputAdorn,
  title: 'input-adorn/InputAdorn'
}

export default meta

type Story = StoryObj<typeof InputAdorn>

export const IconAdorn: Story = {
  render: () => (
    <TextInput
      aria-label="Search"
      placeholder="Search..."
      adornStart={
        <InputAdorn>
          <Icon name="search-outline" size={16} />
        </InputAdorn>
      }
    />
  )
}

export const TextAdorns: Story = {
  render: () => (
    <TextInput
      aria-label="Amount in dollars"
      placeholder="0.00"
      adornStart={<InputAdorn>$</InputAdorn>}
      adornEnd={<InputAdorn>USD</InputAdorn>}
    />
  )
}

// A `component="button"` adorn is the actionable variant — e.g. a password-reveal toggle.
export const ActionableAdorn: Story = {
  render: function PasswordToggle() {
    const [visible, setVisible] = useState(false)
    return (
      <TextInput
        type={visible ? 'text' : 'password'}
        autoComplete="current-password"
        aria-label="Password"
        placeholder="Password"
        adornEnd={
          <InputAdorn
            component="button"
            type="button"
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible(!visible)}
          >
            <Icon name={visible ? 'eye-slash-outline' : 'eye-outline'} size={16} />
          </InputAdorn>
        }
      />
    )
  },
  play: async function ({ canvas, userEvent }) {
    const toggle = canvas.getByRole('button', { name: /show password/i })
    await userEvent.click(toggle)
    await expect(canvas.getByRole('button', { name: /hide password/i })).toBeVisible()
    await expect(canvas.getByLabelText('Password')).toHaveAttribute('type', 'text')
  }
}

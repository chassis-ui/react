import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Textarea } from '../../src/components/textarea/Textarea'

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  title: 'textarea/Textarea'
}

export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    'aria-label': 'Example textarea',
    placeholder: 'Example textarea',
    onChange: fn()
  },
  play: async function ({ args, canvas, userEvent }) {
    const textarea = canvas.getByRole('textbox', { name: /example textarea/i })
    await userEvent.type(textarea, 'Hello')
    await expect(args.onChange).toHaveBeenCalled()
    await expect(textarea).toHaveValue('Hello')
  }
}

export const Rows: Story = {
  render: () => (
    <>
      <Textarea rows={1} placeholder="1 row" aria-label="Textarea with one row" />
      <Textarea rows={4} placeholder="4 rows" aria-label="Textarea with four rows" />
    </>
  )
}

export const WithFormField: Story = {
  args: {
    label: 'Bio',
    help: 'A short description, shown on your public profile'
  }
}

export const Invalid: Story = {
  args: {
    label: 'Bio',
    invalid: true,
    invalidFeedback: 'Bio must be under 200 characters.'
  }
}

export const Readonly: Story = {
  render: () => (
    <>
      <Textarea defaultValue="Readonly textarea" aria-label="Readonly textarea example" readOnly />
      <Textarea
        defaultValue="Readonly disabled textarea"
        aria-label="Readonly disabled textarea example"
        readOnly
        disabled
      />
    </>
  )
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Disabled textarea',
    placeholder: 'Disabled textarea',
    disabled: true
  }
}

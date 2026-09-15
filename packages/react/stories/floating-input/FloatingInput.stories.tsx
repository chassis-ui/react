import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { FloatingInput } from '../../src/components/floating-input/FloatingInput'
import { Select } from '../../src/components/select/Select'
import { Textarea } from '../../src/components/textarea/Textarea'
import { TextInput } from '../../src/components/text-input/TextInput'

const meta: Meta<typeof FloatingInput> = {
  component: FloatingInput,
  title: 'floating-input/FloatingInput'
}

export default meta

type Story = StoryObj<typeof FloatingInput>

export const Default: Story = {
  render: () => (
    <>
      <FloatingInput className="mb-md" label="Email address" ids={{ input: 'floatingInput' }}>
        <TextInput type="email" id="floatingInput" placeholder="name@example.com" />
      </FloatingInput>
      <FloatingInput label="Password" ids={{ input: 'floatingPassword' }}>
        <TextInput type="password" id="floatingPassword" placeholder="Password" />
      </FloatingInput>
    </>
  ),
  play: async function ({ canvas }) {
    await expect(canvas.getByLabelText('Email address')).toBeVisible()
  }
}

export const ExistingValue: Story = {
  render: () => (
    <FloatingInput label="Input with value" ids={{ input: 'floatingInputValue' }}>
      <TextInput
        type="email"
        id="floatingInputValue"
        placeholder="name@example.com"
        defaultValue="test@example.com"
      />
    </FloatingInput>
  )
}

export const HelpAndValidation: Story = {
  render: () => (
    <FloatingInput
      help="We'll never share your email."
      ids={{ help: 'floatingInputHelp', input: 'floatingInputHelpExample' }}
      label="Email address"
    >
      <TextInput
        type="email"
        id="floatingInputHelpExample"
        aria-describedby="floatingInputHelp"
        placeholder="name@example.com"
      />
    </FloatingInput>
  )
}

export const WithTextarea: Story = {
  render: () => (
    <FloatingInput label="Comments" ids={{ input: 'floatingTextarea' }}>
      <Textarea id="floatingTextarea" placeholder="Leave a comment here" />
    </FloatingInput>
  )
}

export const WithSelect: Story = {
  render: () => (
    <FloatingInput label="Works with selects" ids={{ input: 'floatingSelect' }}>
      <Select id="floatingSelect">
        <option>Open this select menu</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Select>
    </FloatingInput>
  )
}

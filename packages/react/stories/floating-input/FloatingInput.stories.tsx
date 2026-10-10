import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, spyOn } from 'storybook/test'

import { FloatingInput } from '../../src/components/floating-input/FloatingInput'
import { Select } from '../../src/components/select/Select'
import { Textarea } from '../../src/components/textarea/Textarea'
import { TextInput } from '../../src/components/text-input/TextInput'

// react-aria warns about a field it finds no label on, and it reads the field's own
// `aria-label`/`aria-labelledby` only: the floating `<label for>` alone names the field and still
// warns (FORMS.md, gotcha 5). A `TextInput` or `Textarea` below names the label through
// `ids.label` as well, and its story fails if the warning comes back.
const LABEL_WARNING = 'If you do not provide a visible label'

const meta: Meta<typeof FloatingInput> = {
  beforeEach: () => {
    const warn = spyOn(console, 'warn')
    return () => warn.mockRestore()
  },
  component: FloatingInput,
  title: 'floating-input/FloatingInput'
}

export default meta

type Story = StoryObj<typeof FloatingInput>

export const Default: Story = {
  render: () => (
    <>
      <FloatingInput
        className="mb-md"
        label="Email address"
        ids={{ input: 'floatingInput', label: 'floatingInputLabel' }}
      >
        <TextInput
          type="email"
          id="floatingInput"
          aria-labelledby="floatingInputLabel"
          placeholder="name@example.com"
        />
      </FloatingInput>
      <FloatingInput
        label="Password"
        ids={{ input: 'floatingPassword', label: 'floatingPasswordLabel' }}
      >
        <TextInput
          type="password"
          id="floatingPassword"
          aria-labelledby="floatingPasswordLabel"
          placeholder="Password"
        />
      </FloatingInput>
    </>
  ),
  play: async function ({ canvas }) {
    await expect(canvas.getByRole('textbox', { name: 'Email address' })).toBeVisible()
    // A password input has no role to query by.
    await expect(canvas.getByLabelText('Password')).toHaveAccessibleName('Password')
    await expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining(LABEL_WARNING))
  }
}

export const ExistingValue: Story = {
  render: () => (
    <FloatingInput
      label="Input with value"
      ids={{ input: 'floatingInputValue', label: 'floatingInputValueLabel' }}
    >
      <TextInput
        type="email"
        id="floatingInputValue"
        aria-labelledby="floatingInputValueLabel"
        placeholder="name@example.com"
        defaultValue="test@example.com"
      />
    </FloatingInput>
  ),
  play: async function ({ canvas }) {
    const input = canvas.getByRole('textbox', { name: 'Input with value' })
    await expect(input).toHaveValue('test@example.com')
    await expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining(LABEL_WARNING))
  }
}

export const HelpAndValidation: Story = {
  render: () => (
    <FloatingInput
      help="We'll never share your email."
      ids={{
        help: 'floatingInputHelp',
        input: 'floatingInputHelpExample',
        label: 'floatingInputHelpExampleLabel'
      }}
      label="Email address"
    >
      <TextInput
        type="email"
        id="floatingInputHelpExample"
        aria-describedby="floatingInputHelp"
        aria-labelledby="floatingInputHelpExampleLabel"
        placeholder="name@example.com"
      />
    </FloatingInput>
  ),
  play: async function ({ canvas }) {
    const input = canvas.getByRole('textbox', { name: 'Email address' })
    await expect(input).toHaveAccessibleDescription("We'll never share your email.")
    await expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining(LABEL_WARNING))
  }
}

export const WithTextarea: Story = {
  render: () => (
    <FloatingInput
      label="Comments"
      ids={{ input: 'floatingTextarea', label: 'floatingTextareaLabel' }}
    >
      <Textarea
        id="floatingTextarea"
        aria-labelledby="floatingTextareaLabel"
        placeholder="Leave a comment here"
      />
    </FloatingInput>
  ),
  play: async function ({ canvas }) {
    await expect(canvas.getByRole('textbox', { name: 'Comments' })).toBeVisible()
    await expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining(LABEL_WARNING))
  }
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

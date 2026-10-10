import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, spyOn } from 'storybook/test'

import { FloatingInput } from '../../src/components/floating-input/FloatingInput'
import { Select } from '../../src/components/select/Select'
import { Textarea } from '../../src/components/textarea/Textarea'
import { TextInput } from '../../src/components/text-input/TextInput'

// react-aria warns about a field it finds no label on, and it reads the field's own
// `aria-label`/`aria-labelledby` only: a `<label for>` alone names the field and still warns
// (FORMS.md, gotcha 5). `FloatingInput` hands the id of its label to the field inside it, and a
// story below fails if the warning comes back.
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
      <FloatingInput className="mb-md" label="Email address">
        <TextInput type="email" placeholder="name@example.com" />
      </FloatingInput>
      <FloatingInput label="Password">
        <TextInput type="password" placeholder="Password" />
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
    <FloatingInput label="Input with value">
      <TextInput type="email" placeholder="name@example.com" defaultValue="test@example.com" />
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
    <FloatingInput help="We'll never share your email." label="Email address">
      <TextInput type="email" placeholder="name@example.com" />
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
    <FloatingInput label="Comments">
      <Textarea placeholder="Leave a comment here" />
    </FloatingInput>
  ),
  play: async function ({ canvas }) {
    await expect(canvas.getByRole('textbox', { name: 'Comments' })).toBeVisible()
    await expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining(LABEL_WARNING))
  }
}

export const WithSelect: Story = {
  render: () => (
    <FloatingInput label="Works with selects">
      <Select>
        <option>Open this select menu</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Select>
    </FloatingInput>
  ),
  play: async function ({ canvas }) {
    await expect(canvas.getByRole('combobox', { name: 'Works with selects' })).toBeVisible()
  }
}

// A control that is not a field component of this library takes no id by itself: it repeats the
// ids passed through `ids`.
export const NativeControl: Story = {
  render: () => (
    <FloatingInput
      help="As it appears on your passport."
      ids={{ help: 'floatingNativeHelp', input: 'floatingNative' }}
      label="Full name"
    >
      <input
        aria-describedby="floatingNativeHelp"
        className="form-input"
        id="floatingNative"
        placeholder="Jane Doe"
        type="text"
      />
    </FloatingInput>
  ),
  play: async function ({ canvas }) {
    const input = canvas.getByRole('textbox', { name: 'Full name' })
    await expect(input).toHaveAccessibleDescription('As it appears on your passport.')
    await expect(console.warn).not.toHaveBeenCalled()
  }
}

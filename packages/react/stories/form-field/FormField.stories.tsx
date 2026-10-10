import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, spyOn } from 'storybook/test'

import { Button } from '../../src/components/button/Button'
import { FormField } from '../../src/components/form-field/FormField'
import { InputGroup } from '../../src/components/input-group/InputGroup'
import { InputGroupAddon } from '../../src/components/input-group/InputGroupAddon'
import { PasswordStrength } from '../../src/components/password-strength/PasswordStrength'
import { TextInput } from '../../src/components/text-input/TextInput'

// react-aria warns about a field it finds no label on, and it reads the field's own
// `aria-label`/`aria-labelledby` only: a `<label for>` alone names the field and still warns
// (FORMS.md, gotcha 5). Each story below names its control through `ids.label` as well, and
// fails if the warning comes back.
const LABEL_WARNING = 'If you do not provide a visible label'

const meta: Meta<typeof FormField> = {
  beforeEach: () => {
    const warn = spyOn(console, 'warn')
    return () => warn.mockRestore()
  },
  component: FormField,
  title: 'form-field/FormField'
}

export default meta

type Story = StoryObj<typeof FormField>

// What `FormField` is for: a control with no field props of its own. An `InputGroup` takes none,
// and a `TextInput` inside one can't take `label` itself, which would put a `.form-field` inside
// the group. `FormField` never touches its children, so the control names the label and the help
// through `ids`.
export const WrappedControl: Story = {
  render: () => (
    <FormField
      label="Coupon code"
      help="One code per order."
      ids={{ help: 'ffCouponHelp', input: 'ffCoupon', label: 'ffCouponLabel' }}
    >
      <InputGroup>
        <TextInput
          aria-describedby="ffCouponHelp"
          aria-labelledby="ffCouponLabel"
          id="ffCoupon"
          name="coupon"
        />
        <Button color="secondary" type="button" variant="outline">
          Apply
        </Button>
      </InputGroup>
    </FormField>
  ),
  play: async function ({ canvas }) {
    const input = canvas.getByRole('textbox', { name: 'Coupon code' })
    await expect(input).toHaveAccessibleDescription('One code per order.')
    await expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining(LABEL_WARNING))
  }
}

export const CompanionContent: Story = {
  render: function CompanionContentFormField() {
    const [password, setPassword] = useState('')
    return (
      <FormField
        label="Password"
        help="Use 8 or more characters with a mix of letters, numbers and symbols."
        ids={{ help: 'ffPasswordHelp', input: 'ffPassword', label: 'ffPasswordLabel' }}
      >
        <TextInput
          aria-describedby="ffPasswordHelp"
          aria-labelledby="ffPasswordLabel"
          autoComplete="new-password"
          id="ffPassword"
          onChange={setPassword}
          type="password"
          value={password}
        />
        <PasswordStrength value={password} />
      </FormField>
    )
  },
  play: async function ({ canvas, userEvent }) {
    // A password input has no role to query by.
    const input = canvas.getByLabelText('Password')
    await expect(input).toHaveAccessibleName('Password')
    await expect(input).toHaveAccessibleDescription(
      'Use 8 or more characters with a mix of letters, numbers and symbols.'
    )
    await expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining(LABEL_WARNING))
    await userEvent.type(input, 'Sup3r!Secret!Passphrase99')
    await expect(canvas.getByText(/strong/i)).toBeVisible()
  }
}

// `FormField` renders the feedback and never touches its children: the control takes `invalid`
// itself, which is what chassis-css shows the feedback by, and names the feedback as its
// description.
export const ValidationFeedback: Story = {
  render: () => (
    <FormField
      label="Username"
      invalid
      invalidFeedback="This username is already taken."
      ids={{ feedback: 'ffUsernameFeedback', input: 'ffUsername', label: 'ffUsernameLabel' }}
    >
      <InputGroup>
        <InputGroupAddon>@</InputGroupAddon>
        <TextInput
          aria-describedby="ffUsernameFeedback"
          aria-labelledby="ffUsernameLabel"
          defaultValue="chassis"
          id="ffUsername"
          invalid
          name="username"
        />
      </InputGroup>
    </FormField>
  ),
  play: async function ({ canvas }) {
    const feedback = canvas.getByText('This username is already taken.')
    await expect(feedback).toBeVisible()
    const input = canvas.getByRole('textbox', { name: 'Username' })
    await expect(input).toBeInvalid()
    await expect(input).toHaveAccessibleDescription('This username is already taken.')
    await expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining(LABEL_WARNING))
  }
}

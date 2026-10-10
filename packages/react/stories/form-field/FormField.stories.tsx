import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { ChipInput } from '../../src/components/chip-input/ChipInput'
import { Combobox } from '../../src/components/combobox/Combobox'
import { ComboboxItem } from '../../src/components/combobox/ComboboxItem'
import { FormField } from '../../src/components/form-field/FormField'
import { PasswordStrength } from '../../src/components/password-strength/PasswordStrength'
import { TextInput } from '../../src/components/text-input/TextInput'

const meta: Meta<typeof FormField> = {
  component: FormField,
  title: 'form-field/FormField'
}

export default meta

type Story = StoryObj<typeof FormField>

export const WrappedControl: Story = {
  render: () => (
    <FormField label="Country" help="The billing region." ids={{ input: 'ffCountry' }}>
      <Combobox id="ffCountry" name="country" placeholder="Pick a country…">
        <ComboboxItem id="us">United States</ComboboxItem>
        <ComboboxItem id="uk">United Kingdom</ComboboxItem>
        <ComboboxItem id="ca">Canada</ComboboxItem>
      </Combobox>
    </FormField>
  )
}

export const CompanionContent: Story = {
  render: () => (
    <FormField label="Password" ids={{ input: 'ffPassword' }}>
      <TextInput autoComplete="new-password" id="ffPassword" type="password" />
      <PasswordStrength value="" />
    </FormField>
  )
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
      ids={{ feedback: 'ffUsernameFeedback', input: 'ffUsername' }}
    >
      <ChipInput aria-describedby="ffUsernameFeedback" id="ffUsername" invalid name="username" />
    </FormField>
  ),
  play: async function ({ canvas }) {
    const feedback = canvas.getByText('This username is already taken.')
    await expect(feedback).toBeVisible()
    const input = canvas.getByRole('textbox')
    await expect(input).toBeInvalid()
    await expect(input).toHaveAccessibleDescription('This username is already taken.')
  }
}

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

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

export const ValidationFeedback: Story = {
  render: () => (
    <FormField
      label="Username"
      invalid
      invalidFeedback="This username is already taken."
      ids={{ input: 'ffUsername' }}
    >
      <ChipInput id="ffUsername" name="username" />
    </FormField>
  )
}

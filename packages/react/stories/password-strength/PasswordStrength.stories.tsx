import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { FormField } from '../../src/components/form-field/FormField'
import { PasswordStrength } from '../../src/components/password-strength/PasswordStrength'
import { TextInput } from '../../src/components/text-input/TextInput'

const meta: Meta<typeof PasswordStrength> = {
  component: PasswordStrength,
  title: 'password-strength/PasswordStrength'
}

export default meta

type Story = StoryObj<typeof PasswordStrength>

export const Default: Story = {
  render: function DefaultPasswordStrength() {
    const [password, setPassword] = useState('')
    return (
      <FormField label="Password" ids={{ input: 'password1' }}>
        <TextInput
          autoComplete="new-password"
          id="password1"
          onChange={setPassword}
          placeholder="Enter password"
          type="password"
          value={password}
        />
        <PasswordStrength value={password} />
      </FormField>
    )
  },
  play: async function ({ canvas, userEvent }) {
    const input = canvas.getByLabelText('Password')
    await userEvent.type(input, 'Sup3r!Secret!Passphrase99')
    await expect(canvas.getByText(/strong/i)).toBeVisible()
  }
}

export const BarVariant: Story = {
  render: function BarPasswordStrength() {
    const [password, setPassword] = useState('correct horse battery staple')
    return (
      <FormField label="Password" ids={{ input: 'password2' }}>
        <TextInput
          autoComplete="new-password"
          id="password2"
          onChange={setPassword}
          placeholder="Enter password"
          type="password"
          value={password}
        />
        <PasswordStrength value={password} variant="bar" />
      </FormField>
    )
  }
}

export const Levels: Story = {
  render: () => {
    const samples = [
      { label: 'Weak', password: 'abc' },
      { label: 'Fair', password: 'abcdefgh1' },
      { label: 'Good', password: 'Abcdefgh1234' },
      { label: 'Strong', password: 'Sup3r!Secret!Passphrase99' }
    ]
    return (
      <div className="vstack gap-md">
        {samples.map(({ label, password }) => (
          <div key={label}>
            <div className="fg-md">{label}</div>
            <PasswordStrength aria-label={`${label} example`} value={password} />
          </div>
        ))}
      </div>
    )
  }
}

export const CustomWeights: Story = {
  render: function CustomWeightsPasswordStrength() {
    const [password, setPassword] = useState('nouppercasebutlong123')
    return (
      <FormField label="Password" ids={{ input: 'password4' }}>
        <TextInput
          autoComplete="new-password"
          id="password4"
          onChange={setPassword}
          placeholder="No uppercase required, symbols count double"
          type="password"
          value={password}
        />
        <PasswordStrength
          messages={{ weak: 'Too weak', strong: 'Excellent!' }}
          thresholds={[3, 5, 7]}
          value={password}
          weights={{ special: 2, uppercase: 0 }}
        />
      </FormField>
    )
  }
}

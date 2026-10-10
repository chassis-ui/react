import { useState } from 'react'
import { TextInput, FormField, PasswordStrength } from '@chassis-ui/react'

export const Example = () => {
  const [password, setPassword] = useState('')

  return (
    <FormField label="Password" ids={{ input: 'password1', label: 'password1Label' }}>
      <TextInput
        aria-labelledby="password1Label"
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
}

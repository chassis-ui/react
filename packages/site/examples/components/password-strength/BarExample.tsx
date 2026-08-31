import { useState } from 'react'
import { TextInput, FormField, PasswordStrength } from '@chassis-ui/react'

export const Example = () => {
  const [password, setPassword] = useState('')

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

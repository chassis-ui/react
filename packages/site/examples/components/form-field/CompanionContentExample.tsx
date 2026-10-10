import { useState } from 'react'
import { FormField, PasswordStrength, TextInput } from '@chassis-ui/react'

export const Example = () => {
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
}

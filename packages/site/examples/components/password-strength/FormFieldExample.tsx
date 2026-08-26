import { useState } from 'react'
import { TextInput, FormField, PasswordStrength } from '@chassis-ui/react'

export const Example = () => {
  const [password, setPassword] = useState('')

  return (
    <FormField
      label="Password"
      help="Use 8 or more characters with a mix of letters, numbers & symbols."
      ids={{ help: 'password3Help', input: 'password3' }}
    >
      <TextInput
        aria-describedby="password3Help"
        autoComplete="new-password"
        id="password3"
        onChange={setPassword}
        placeholder="Enter password"
        type="password"
        value={password}
      />
      <PasswordStrength value={password} />
    </FormField>
  )
}

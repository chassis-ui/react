import { useState } from 'react'
import { TextInput, FormField, PasswordStrength } from '@chassis-ui/react'

export const Example = () => {
  const [password, setPassword] = useState('')

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

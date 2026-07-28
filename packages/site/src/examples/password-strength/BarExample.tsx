import { useState } from 'react'
import { CxTextInput, CxFormField, CxPasswordStrength } from '@chassis-ui/react'

export const BarExample = () => {
  const [password, setPassword] = useState('')

  return (
    <CxFormField label="Password" ids={{ input: 'password2' }}>
      <CxTextInput
        autoComplete="new-password"
        id="password2"
        onChange={setPassword}
        placeholder="Enter password"
        type="password"
        value={password}
      />
      <CxPasswordStrength value={password} variant="bar" />
    </CxFormField>
  )
}

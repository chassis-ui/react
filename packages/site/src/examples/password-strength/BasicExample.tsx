import { useState } from 'react'
import { CxTextInput, CxFormField, CxPasswordStrength } from '@chassis-ui/react'

export const BasicExample = () => {
  const [password, setPassword] = useState('')

  return (
    <CxFormField label="Password" ids={{ input: 'password1' }}>
      <CxTextInput
        autoComplete="new-password"
        id="password1"
        onChange={setPassword}
        placeholder="Enter password"
        type="password"
        value={password}
      />
      <CxPasswordStrength value={password} />
    </CxFormField>
  )
}

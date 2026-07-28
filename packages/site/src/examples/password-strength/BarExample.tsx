import { useState } from 'react'
import { CxTextInput, CxFormLabel, CxPasswordStrength } from '@chassis-ui/react'

export const BarExample = () => {
  const [password, setPassword] = useState('')

  return (
    <div className="form-field">
      <CxFormLabel htmlFor="password2">Password</CxFormLabel>
      <CxTextInput
        autoComplete="new-password"
        id="password2"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter password"
        type="password"
        value={password}
      />
      <CxPasswordStrength value={password} variant="bar" />
    </div>
  )
}

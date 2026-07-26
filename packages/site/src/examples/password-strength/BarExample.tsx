import { useState } from 'react'
import { CxFormInput, CxFormLabel, CxPasswordStrength } from '@chassis-ui/react'

export const BarExample = () => {
  const [password, setPassword] = useState('')

  return (
    <div className="form-field">
      <CxFormLabel htmlFor="password2">Password</CxFormLabel>
      <CxFormInput
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

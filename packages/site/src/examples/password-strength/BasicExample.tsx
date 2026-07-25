import React, { useState } from 'react'
import { CxFormInput, CxFormLabel, CxPasswordStrength } from '@chassis-ui/react'

export const BasicExample = () => {
  const [password, setPassword] = useState('')

  return (
    <div className="form-field">
      <CxFormLabel htmlFor="password1">Password</CxFormLabel>
      <CxFormInput
        autoComplete="new-password"
        id="password1"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter password"
        type="password"
        value={password}
      />
      <CxPasswordStrength value={password} />
    </div>
  )
}

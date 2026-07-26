import { useState } from 'react'
import { CxFormInput, CxFormLabel, CxPasswordStrength } from '@chassis-ui/react'

export const CustomWeightsExample = () => {
  const [password, setPassword] = useState('')

  return (
    <div className="form-field">
      <CxFormLabel htmlFor="password4">Password</CxFormLabel>
      <CxFormInput
        autoComplete="new-password"
        id="password4"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="No uppercase required, symbols count double"
        type="password"
        value={password}
      />
      <CxPasswordStrength
        messages={{ weak: 'Too weak', strong: 'Excellent!' }}
        thresholds={[3, 5, 7]}
        value={password}
        weights={{ special: 2, uppercase: 0 }}
      />
    </div>
  )
}

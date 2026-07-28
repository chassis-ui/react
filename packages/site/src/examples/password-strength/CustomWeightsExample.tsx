import { useState } from 'react'
import { CxTextInput, CxFormField, CxPasswordStrength } from '@chassis-ui/react'

export const CustomWeightsExample = () => {
  const [password, setPassword] = useState('')

  return (
    <CxFormField label="Password" ids={{ input: 'password4' }}>
      <CxTextInput
        autoComplete="new-password"
        id="password4"
        onChange={setPassword}
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
    </CxFormField>
  )
}

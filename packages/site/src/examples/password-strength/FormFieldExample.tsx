import { useState } from 'react'
import { CxTextInput, CxFormLabel, CxFormHelp, CxPasswordStrength } from '@chassis-ui/react'

export const FormFieldExample = () => {
  const [password, setPassword] = useState('')

  return (
    <div className="form-field">
      <CxFormLabel htmlFor="password3">Password</CxFormLabel>
      <CxTextInput
        aria-describedby="password3Help"
        autoComplete="new-password"
        id="password3"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter password"
        type="password"
        value={password}
      />
      <CxPasswordStrength value={password} />
      <CxFormHelp id="password3Help">
        Use 8 or more characters with a mix of letters, numbers &amp; symbols.
      </CxFormHelp>
    </div>
  )
}

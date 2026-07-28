import { useState } from 'react'
import { CxTextInput, CxFormField, CxPasswordStrength } from '@chassis-ui/react'

export const FormFieldExample = () => {
  const [password, setPassword] = useState('')

  return (
    <CxFormField
      label="Password"
      help="Use 8 or more characters with a mix of letters, numbers & symbols."
      ids={{ help: 'password3Help', input: 'password3' }}
    >
      <CxTextInput
        aria-describedby="password3Help"
        autoComplete="new-password"
        id="password3"
        onChange={setPassword}
        placeholder="Enter password"
        type="password"
        value={password}
      />
      <CxPasswordStrength value={password} />
    </CxFormField>
  )
}

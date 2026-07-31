import { useState } from 'react'
import { CxIcon, CxInputHelp, CxTextInput } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)

  return (
    <CxTextInput
      type={visible ? 'text' : 'password'}
      autoComplete="current-password"
      aria-label="Password"
      placeholder="Password"
      adornEnd={
        <CxInputHelp
          component="button"
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible(!visible)}
        >
          <CxIcon name={visible ? 'eye-slash-outline' : 'eye-outline'} size={16} />
        </CxInputHelp>
      }
    />
  )
}

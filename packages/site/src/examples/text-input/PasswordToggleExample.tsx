import { useState } from 'react'
import { CxIcon, CxInputAdorn, CxTextInput } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  const toggleButton = (
    <CxInputAdorn
      component="button"
      type="button"
      aria-label={visible ? 'Hide password' : 'Show password'}
      onClick={() => setVisible(!visible)}
    >
      <CxIcon name={visible ? 'eye-slash-outline' : 'eye-outline'} size={16} />
    </CxInputAdorn>
  )

  return (
    <CxTextInput
      type={visible ? 'text' : 'password'}
      autoComplete="current-password"
      aria-label="Password"
      placeholder="Password"
      adornEnd={toggleButton}
    />
  )
}

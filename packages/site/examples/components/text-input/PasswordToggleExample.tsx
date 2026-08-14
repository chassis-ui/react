import { useState } from 'react'
import { Icon, InputAdorn, TextInput } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  const toggleButton = (
    <InputAdorn
      component="button"
      type="button"
      aria-label={visible ? 'Hide password' : 'Show password'}
      onClick={() => setVisible(!visible)}
    >
      <Icon name={visible ? 'eye-slash-outline' : 'eye-outline'} size={16} />
    </InputAdorn>
  )

  return (
    <TextInput
      type={visible ? 'text' : 'password'}
      autoComplete="current-password"
      aria-label="Password"
      placeholder="Password"
      adornEnd={toggleButton}
    />
  )
}

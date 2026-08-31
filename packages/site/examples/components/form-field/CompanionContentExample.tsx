import { FormField, PasswordStrength, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FormField label="Password" ids={{ input: 'ffPassword' }}>
      <TextInput autoComplete="new-password" id="ffPassword" type="password" />
      <PasswordStrength value="" />
    </FormField>
  )
}

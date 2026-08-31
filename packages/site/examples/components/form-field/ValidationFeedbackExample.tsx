import { ChipInput, FormField } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FormField
      label="Username"
      invalid
      invalidFeedback="This username is already taken."
      ids={{ input: 'ffUsername' }}
    >
      <ChipInput id="ffUsername" name="username" />
    </FormField>
  )
}

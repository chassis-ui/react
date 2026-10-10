import { ChipInput, FormField } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FormField
      label="Username"
      invalid
      invalidFeedback="This username is already taken."
      ids={{ feedback: 'ffUsernameFeedback', input: 'ffUsername' }}
    >
      <ChipInput aria-describedby="ffUsernameFeedback" id="ffUsername" invalid name="username" />
    </FormField>
  )
}

import { FormField, InputGroup, InputGroupAddon, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FormField
      label="Username"
      invalid
      invalidFeedback="This username is already taken."
      ids={{ feedback: 'ffUsernameFeedback', input: 'ffUsername', label: 'ffUsernameLabel' }}
    >
      <InputGroup>
        <InputGroupAddon>@</InputGroupAddon>
        <TextInput
          aria-describedby="ffUsernameFeedback"
          aria-labelledby="ffUsernameLabel"
          defaultValue="chassis"
          id="ffUsername"
          invalid
          name="username"
        />
      </InputGroup>
    </FormField>
  )
}

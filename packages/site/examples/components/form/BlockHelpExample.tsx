import { Form, FormHelp, FormLabel, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Form>
      <div className="mb-md">
        <FormLabel htmlFor="inputPassword5" id="inputPassword5Label">
          Password
        </FormLabel>
        <TextInput
          autoComplete="new-password"
          type="password"
          id="inputPassword5"
          aria-describedby="passwordHelpBlock"
          aria-labelledby="inputPassword5Label"
        />
        <FormHelp id="passwordHelpBlock">
          Your password must be 8-20 characters long, contain letters and numbers, and must not
          contain spaces, special characters, or emoji.
        </FormHelp>
      </div>
    </Form>
  )
}

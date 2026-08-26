import { Form, FormHelp, FormLabel, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Form>
      <div className="mb-medium">
        <FormLabel htmlFor="inputPassword5">Password</FormLabel>
        <TextInput type="password" id="inputPassword5" aria-describedby="passwordHelpBlock" />
        <FormHelp id="passwordHelpBlock">
          Your password must be 8-20 characters long, contain letters and numbers, and must not
          contain spaces, special characters, or emoji.
        </FormHelp>
      </div>
    </Form>
  )
}

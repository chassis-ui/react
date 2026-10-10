import { Button, Checkbox, Form, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Form>
      <div className="mb-md">
        <TextInput
          type="email"
          label="Email address"
          help="We'll never share your email with anyone else."
        />
      </div>
      <div className="mb-md">
        <TextInput autoComplete="current-password" type="password" label="Email Password" />
      </div>
      <Checkbox
        className="mb-md"
        label="Check me out"
        onChange={(isSelected) => {
          console.log(isSelected)
        }}
      />
      <Button type="submit" color="primary">
        Submit
      </Button>
    </Form>
  )
}

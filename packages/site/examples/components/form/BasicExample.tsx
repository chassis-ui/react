import { Button, Checkbox, Form, FormHelp, FormLabel, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Form>
      <div className="mb-medium">
        <FormLabel htmlFor="exampleInputEmail1">Email address</FormLabel>
        <TextInput type="email" id="exampleInputEmail1" aria-describedby="emailHelp" />
        <FormHelp id="emailHelp">We'll never share your email with anyone else.</FormHelp>
      </div>
      <div className="mb-medium">
        <FormLabel htmlFor="exampleInputPassword1">Email Password</FormLabel>
        <TextInput type="password" id="exampleInputPassword1" />
      </div>
      <Checkbox
        className="mb-medium"
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

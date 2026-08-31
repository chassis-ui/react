import { Button, Checkbox, Col, Form, FormLabel, Select, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Form className="row g-3">
      <Col responsive={{ medium: { span: 6 } }}>
        <FormLabel htmlFor="inputEmail4">Email</FormLabel>
        <TextInput type="email" id="inputEmail4" />
      </Col>
      <Col responsive={{ medium: { span: 6 } }}>
        <FormLabel htmlFor="inputPassword4">Password</FormLabel>
        <TextInput type="password" id="inputPassword4" />
      </Col>
      <Col span={12}>
        <FormLabel htmlFor="inputAddress">Address</FormLabel>
        <TextInput id="inputAddress" placeholder="1234 Main St" />
      </Col>
      <Col span={12}>
        <FormLabel htmlFor="inputAddress2">Address 2</FormLabel>
        <TextInput id="inputAddress2" placeholder="Apartment, studio, or floor" />
      </Col>
      <Col responsive={{ medium: { span: 6 } }}>
        <FormLabel htmlFor="inputCity">City</FormLabel>
        <TextInput id="inputCity" />
      </Col>
      <Col responsive={{ medium: { span: 4 } }}>
        <FormLabel htmlFor="inputState">State</FormLabel>
        <Select id="inputState">
          <option>Choose...</option>
          <option>...</option>
        </Select>
      </Col>
      <Col responsive={{ medium: { span: 2 } }}>
        <FormLabel htmlFor="inputZip">Zip</FormLabel>
        <TextInput id="inputZip" />
      </Col>
      <Col span={12}>
        <Checkbox id="gridCheck" label="Check me out" />
      </Col>
      <Col span={12}>
        <Button type="submit">Sign in</Button>
      </Col>
    </Form>
  )
}

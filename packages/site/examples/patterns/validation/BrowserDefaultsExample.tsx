import React from 'react'
import {
  Button,
  Checkbox,
  Col,
  Form,
  FormLabel,
  InputGroup,
  InputGroupAddon,
  Select,
  TextInput
} from '@chassis-ui/react'

export const Example = () => (
  <Form className="row g-3">
    <Col responsive={{ medium: { span: 4 } }}>
      <TextInput label="First name" defaultValue="Mark" required />
    </Col>
    <Col responsive={{ medium: { span: 4 } }}>
      <TextInput label="Last name" defaultValue="Otto" required />
    </Col>
    <Col responsive={{ medium: { span: 4 } }}>
      <FormLabel htmlFor="validationDefaultUsername">Username</FormLabel>
      <InputGroup>
        <InputGroupAddon>@</InputGroupAddon>
        <TextInput id="validationDefaultUsername" required />
      </InputGroup>
    </Col>
    <Col responsive={{ medium: { span: 6 } }}>
      <TextInput label="City" required />
    </Col>
    <Col responsive={{ medium: { span: 3 } }}>
      <Select label="State" required>
        <option disabled value="">
          Choose...
        </option>
        <option>California</option>
        <option>New York</option>
      </Select>
    </Col>
    <Col responsive={{ medium: { span: 3 } }}>
      <TextInput label="Zip" required />
    </Col>
    <Col span={12}>
      <Checkbox label="Agree to terms and conditions" required />
    </Col>
    <Col span={12}>
      <Button color="primary" type="submit">
        Submit form
      </Button>
    </Col>
  </Form>
)

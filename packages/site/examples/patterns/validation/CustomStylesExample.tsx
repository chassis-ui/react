import React from 'react'
import { useState } from 'react'
import {
  Button,
  Form,
  Checkbox,
  TextInput,
  FormFeedback,
  FormLabel,
  Select,
  InputGroup,
  Col,
  InputGroupAddon
} from '@chassis-ui/react'

export const CustomStylesExample = () => {
  const [validated, setValidated] = useState(false)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }
  return (
    <Form
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <Col responsive={{ medium: { span: 4 } }}>
        <FormLabel htmlFor="validationCustom01">Email</FormLabel>
        <TextInput type="text" id="validationCustom01" defaultValue="Mark" required />
        <FormFeedback valid>Looks good!</FormFeedback>
      </Col>
      <Col responsive={{ medium: { span: 4 } }}>
        <FormLabel htmlFor="validationCustom02">Email</FormLabel>
        <TextInput type="text" id="validationCustom02" defaultValue="Otto" required />
        <FormFeedback valid>Looks good!</FormFeedback>
      </Col>
      <Col responsive={{ medium: { span: 4 } }}>
        <FormLabel htmlFor="validationCustomUsername">Username</FormLabel>
        <InputGroup className="has-validation">
          <InputGroupAddon id="inputGroupPrepend">@</InputGroupAddon>
          <TextInput
            type="text"
            id="validationCustomUsername"
            defaultValue=""
            aria-describedby="inputGroupPrepend"
            required
          />
          <FormFeedback invalid>Please choose a username.</FormFeedback>
        </InputGroup>
      </Col>
      <Col responsive={{ medium: { span: 6 } }}>
        <FormLabel htmlFor="validationCustom03">City</FormLabel>
        <TextInput type="text" id="validationCustom03" required />
        <FormFeedback invalid>Please provide a valid city.</FormFeedback>
      </Col>
      <Col responsive={{ medium: { span: 3 } }}>
        <FormLabel htmlFor="validationCustom04">City</FormLabel>
        <Select id="validationCustom04">
          <option disabled>Choose...</option>
          <option>...</option>
        </Select>
        <FormFeedback invalid>Please provide a valid city.</FormFeedback>
      </Col>
      <Col responsive={{ medium: { span: 3 } }}>
        <FormLabel htmlFor="validationCustom05">City</FormLabel>
        <TextInput type="text" id="validationCustom05" required />
        <FormFeedback invalid>Please provide a valid zip.</FormFeedback>
      </Col>
      <Col span={12}>
        <Checkbox
          type="checkbox"
          id="invalidCheck"
          label="Agree to terms and conditions"
          required
        />
        <FormFeedback invalid>You must agree before submitting.</FormFeedback>
      </Col>
      <Col span={12}>
        <Button color="primary" type="submit">
          Submit form
        </Button>
      </Col>
    </Form>
  )
}

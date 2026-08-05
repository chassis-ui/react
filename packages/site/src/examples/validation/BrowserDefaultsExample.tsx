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
  Col
} from '@chassis-ui/react'

export const BrowserDefaultsExample = () => {
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
    <Form className="row g-3 needs-validation" validated={validated} onSubmit={handleSubmit}>
      <Col md={4}>
        <FormLabel htmlFor="validationDefault01">Email</FormLabel>
        <TextInput type="text" id="validationDefault01" defaultValue="Mark" required />
        <FormFeedback valid>Looks good!</FormFeedback>
      </Col>
      <Col md={4}>
        <FormLabel htmlFor="validationDefault02">Email</FormLabel>
        <TextInput type="text" id="validationDefault02" defaultValue="Otto" required />
        <FormFeedback valid>Looks good!</FormFeedback>
      </Col>
      <Col md={4}>
        <FormLabel htmlFor="validationDefaultUsername">Username</FormLabel>
        <InputGroup className="has-validation">
          <InputGroup.Addon id="inputGroupPrepend02">@</InputGroup.Addon>
          <TextInput
            type="text"
            id="validationDefaultUsername"
            defaultValue=""
            aria-describedby="inputGroupPrepend02"
            required
          />
          <FormFeedback invalid>Please choose a username.</FormFeedback>
        </InputGroup>
      </Col>
      <Col md={6}>
        <FormLabel htmlFor="validationDefault03">City</FormLabel>
        <TextInput type="text" id="validationDefault03" required />
        <FormFeedback invalid>Please provide a valid city.</FormFeedback>
      </Col>
      <Col md={3}>
        <FormLabel htmlFor="validationDefault04">City</FormLabel>
        <Select id="validationDefault04">
          <option disabled>Choose...</option>
          <option>...</option>
        </Select>
        <FormFeedback invalid>Please provide a valid city.</FormFeedback>
      </Col>
      <Col md={3}>
        <FormLabel htmlFor="validationDefault05">City</FormLabel>
        <TextInput type="text" id="validationDefault05" required />
        <FormFeedback invalid>Please provide a valid zip.</FormFeedback>
      </Col>
      <Col xs={12}>
        <Checkbox
          type="checkbox"
          id="invalidCheck"
          label="Agree to terms and conditions"
          required
        />
        <FormFeedback invalid>You must agree before submitting.</FormFeedback>
      </Col>
      <Col xs={12}>
        <Button color="primary" type="submit">
          Submit form
        </Button>
      </Col>
    </Form>
  )
}

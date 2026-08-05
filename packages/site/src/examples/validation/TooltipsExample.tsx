import React from 'react'
import { useState } from 'react'
import {
  Button,
  Form,
  TextInput,
  FormFeedback,
  FormLabel,
  Select,
  InputGroup,
  Col,
  InputGroupAddon
} from '@chassis-ui/react'

export const TooltipsExample = () => {
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
      <Col md={4} className="position-relative">
        <FormLabel htmlFor="validationTooltip01">Email</FormLabel>
        <TextInput type="text" id="validationTooltip01" defaultValue="Mark" required />
        <FormFeedback tooltip valid>
          Looks good!
        </FormFeedback>
      </Col>
      <Col md={4} className="position-relative">
        <FormLabel htmlFor="validationTooltip02">Email</FormLabel>
        <TextInput type="text" id="validationTooltip02" defaultValue="Otto" required />
        <FormFeedback tooltip valid>
          Looks good!
        </FormFeedback>
      </Col>
      <Col md={4} className="position-relative">
        <FormLabel htmlFor="validationTooltipUsername">Username</FormLabel>
        <InputGroup className="has-validation">
          <InputGroupAddon id="inputGroupPrepend">@</InputGroupAddon>
          <TextInput
            type="text"
            id="validationTooltipUsername"
            defaultValue=""
            aria-describedby="inputGroupPrepend"
            required
          />
          <FormFeedback tooltip invalid>
            Please choose a username.
          </FormFeedback>
        </InputGroup>
      </Col>
      <Col md={6} className="position-relative">
        <FormLabel htmlFor="validationTooltip03">City</FormLabel>
        <TextInput type="text" id="validationTooltip03" required />
        <FormFeedback tooltip invalid>
          Please provide a valid city.
        </FormFeedback>
      </Col>
      <Col md={3} className="position-relative">
        <FormLabel htmlFor="validationTooltip04">City</FormLabel>
        <Select id="validationTooltip04" required>
          <option disabled value="">
            Choose...
          </option>
          <option>...</option>
        </Select>
        <FormFeedback tooltip invalid>
          Please provide a valid city.
        </FormFeedback>
      </Col>
      <Col md={3} className="position-relative">
        <FormLabel htmlFor="validationTooltip05">City</FormLabel>
        <TextInput type="text" id="validationTooltip05" required />
        <FormFeedback tooltip invalid>
          Please provide a valid zip.
        </FormFeedback>
      </Col>
      <Col xs={12} className="position-relative">
        <Button color="primary" type="submit">
          Submit form
        </Button>
      </Col>
    </Form>
  )
}

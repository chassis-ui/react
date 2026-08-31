import React, { useState } from 'react'
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormLabel,
  InputGroup,
  InputGroupAddon,
  Select,
  TextInput
} from '@chassis-ui/react'

export const Example = () => {
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
    <Form className="row g-3" noValidate validated={validated} onSubmit={handleSubmit}>
      <Col responsive={{ medium: { span: 4 } }} className="position-relative">
        <FormLabel htmlFor="validationTooltip01">First name</FormLabel>
        <TextInput id="validationTooltip01" defaultValue="Mark" required />
        <FormFeedback tooltip valid>
          Looks good!
        </FormFeedback>
      </Col>
      <Col responsive={{ medium: { span: 4 } }} className="position-relative">
        <FormLabel htmlFor="validationTooltip02">Last name</FormLabel>
        <TextInput id="validationTooltip02" defaultValue="Otto" required />
        <FormFeedback tooltip valid>
          Looks good!
        </FormFeedback>
      </Col>
      <Col responsive={{ medium: { span: 4 } }} className="position-relative">
        <FormLabel htmlFor="validationTooltipUsername">Username</FormLabel>
        <InputGroup className="has-validation">
          <InputGroupAddon id="inputGroupPrepend">@</InputGroupAddon>
          <TextInput id="validationTooltipUsername" aria-describedby="inputGroupPrepend" required />
        </InputGroup>
        <FormFeedback tooltip invalid>
          Please choose a username.
        </FormFeedback>
      </Col>
      <Col responsive={{ medium: { span: 6 } }} className="position-relative">
        <FormLabel htmlFor="validationTooltip03">City</FormLabel>
        <TextInput id="validationTooltip03" required />
        <FormFeedback tooltip invalid>
          Please provide a valid city.
        </FormFeedback>
      </Col>
      <Col responsive={{ medium: { span: 3 } }} className="position-relative">
        <FormLabel htmlFor="validationTooltip04">State</FormLabel>
        <Select id="validationTooltip04" required>
          <option disabled value="">
            Choose...
          </option>
          <option>California</option>
          <option>New York</option>
        </Select>
        <FormFeedback tooltip invalid>
          Please select a valid state.
        </FormFeedback>
      </Col>
      <Col responsive={{ medium: { span: 3 } }} className="position-relative">
        <FormLabel htmlFor="validationTooltip05">Zip</FormLabel>
        <TextInput id="validationTooltip05" required />
        <FormFeedback tooltip invalid>
          Please provide a valid zip.
        </FormFeedback>
      </Col>
      <Col span={12}>
        <Button color="primary" type="submit">
          Submit form
        </Button>
      </Col>
    </Form>
  )
}

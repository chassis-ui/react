import React, { useState } from 'react'
import {
  Button,
  Checkbox,
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
      <Col responsive={{ medium: { span: 4 } }}>
        <TextInput label="First name" defaultValue="Mark" validFeedback="Looks good!" required />
      </Col>
      <Col responsive={{ medium: { span: 4 } }}>
        <TextInput label="Last name" defaultValue="Otto" validFeedback="Looks good!" required />
      </Col>
      <Col responsive={{ medium: { span: 4 } }}>
        <FormLabel htmlFor="validationCustomUsername">Username</FormLabel>
        <InputGroup className="has-validation">
          <InputGroupAddon id="inputGroupPrepend">@</InputGroupAddon>
          <TextInput
            id="validationCustomUsername"
            aria-describedby="inputGroupPrepend usernameFeedback"
            required
          />
        </InputGroup>
        <FormFeedback id="usernameFeedback" invalid>
          Please choose a username.
        </FormFeedback>
      </Col>
      <Col responsive={{ medium: { span: 6 } }}>
        <TextInput label="City" invalidFeedback="Please provide a valid city." required />
      </Col>
      <Col responsive={{ medium: { span: 3 } }}>
        <Select label="State" invalidFeedback="Please select a valid state." required>
          <option disabled value="">
            Choose...
          </option>
          <option>California</option>
          <option>New York</option>
        </Select>
      </Col>
      <Col responsive={{ medium: { span: 3 } }}>
        <TextInput label="Zip" invalidFeedback="Please provide a valid zip." required />
      </Col>
      <Col span={12}>
        <Checkbox label="Agree to terms and conditions" aria-describedby="agreeFeedback" required />
        <FormFeedback id="agreeFeedback" invalid>
          You must agree before submitting.
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

import React from 'react'
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

export const Example = () => (
  <Form className="row g-3">
    <Col responsive={{ medium: { span: 4 } }}>
      <TextInput label="First name" defaultValue="Mark" validFeedback="Looks good!" valid />
    </Col>
    <Col responsive={{ medium: { span: 4 } }}>
      <TextInput label="Last name" defaultValue="Otto" validFeedback="Looks good!" valid />
    </Col>
    <Col responsive={{ medium: { span: 4 } }}>
      <FormLabel htmlFor="validationServerUsername">Username</FormLabel>
      <InputGroup className="has-validation">
        <InputGroupAddon id="inputGroupPrepend03">@</InputGroupAddon>
        <TextInput
          id="validationServerUsername"
          aria-describedby="inputGroupPrepend03 validationServerUsernameFeedback"
          invalid
        />
      </InputGroup>
      <FormFeedback id="validationServerUsernameFeedback" invalid>
        Please choose a username.
      </FormFeedback>
    </Col>
    <Col responsive={{ medium: { span: 6 } }}>
      <TextInput label="City" invalidFeedback="Please provide a valid city." invalid />
    </Col>
    <Col responsive={{ medium: { span: 3 } }}>
      <Select label="State" invalidFeedback="Please select a valid state." invalid>
        <option disabled value="">
          Choose...
        </option>
        <option>California</option>
        <option>New York</option>
      </Select>
    </Col>
    <Col responsive={{ medium: { span: 3 } }}>
      <TextInput label="Zip" invalidFeedback="Please provide a valid zip." invalid />
    </Col>
    <Col span={12}>
      <Checkbox
        label="Agree to terms and conditions"
        aria-describedby="invalidCheckFeedback"
        invalid
        required
      />
      <FormFeedback id="invalidCheckFeedback" invalid>
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

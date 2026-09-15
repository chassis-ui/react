import {
  Button,
  Col,
  Form,
  Checkbox,
  TextInput,
  FormLabel,
  Radio,
  RadioGroup,
  Row
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <Form>
      <Row className="mb-md">
        <FormLabel htmlFor="inputEmail3" className="sm:col-2 col-form-label">
          Email
        </FormLabel>
        <Col responsive={{ sm: { span: 10 } }}>
          <TextInput type="email" id="inputEmail3" />
        </Col>
      </Row>
      <Row className="mb-md">
        <FormLabel htmlFor="inputPassword3" className="sm:col-2 col-form-label">
          Password
        </FormLabel>
        <Col responsive={{ sm: { span: 10 } }}>
          <TextInput type="password" id="inputPassword3" />
        </Col>
      </Row>
      <RadioGroup className="row mb-md" label="Radios" defaultValue="option1">
        <Col responsive={{ sm: { span: 10 } }}>
          <Radio value="option1" label="First radio" />
          <Radio value="option2" label="Second radio" />
          <Radio value="option3" label="Third disabled radio" disabled />
        </Col>
      </RadioGroup>
      <Row className="mb-md">
        <div className="sm:col-10 sm:offset-2">
          <Checkbox id="gridCheck1" label="Example checkbox" />
        </div>
      </Row>
      <Button type="submit">Sign in</Button>
    </Form>
  )
}

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
      <Row className="mb-medium">
        <FormLabel htmlFor="inputEmail3" className="small:col-2 col-form-label">
          Email
        </FormLabel>
        <Col responsive={{ small: { span: 10 } }}>
          <TextInput type="email" id="inputEmail3" />
        </Col>
      </Row>
      <Row className="mb-medium">
        <FormLabel htmlFor="inputPassword3" className="small:col-2 col-form-label">
          Password
        </FormLabel>
        <Col responsive={{ small: { span: 10 } }}>
          <TextInput type="password" id="inputPassword3" />
        </Col>
      </Row>
      <RadioGroup className="row mb-medium" label="Radios" defaultValue="option1">
        <Col responsive={{ small: { span: 10 } }}>
          <Radio value="option1" label="First radio" />
          <Radio value="option2" label="Second radio" />
          <Radio value="option3" label="Third disabled radio" disabled />
        </Col>
      </RadioGroup>
      <Row className="mb-medium">
        <div className="small:col-10 small:offset-2">
          <Checkbox id="gridCheck1" label="Example checkbox" />
        </div>
      </Row>
      <Button type="submit">Sign in</Button>
    </Form>
  )
}

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

export const Example = () => {
  return (
    <Form className="row gx-3 gy-2 align-items-center">
      <Col responsive={{ small: { span: 3 } }}>
        <FormLabel className="visually-hidden" htmlFor="specificSizeInputName">
          Name
        </FormLabel>
        <TextInput id="specificSizeInputName" placeholder="Jane Doe" />
      </Col>
      <Col responsive={{ small: { span: 3 } }}>
        <FormLabel className="visually-hidden" htmlFor="specificSizeInputGroupUsername">
          Username
        </FormLabel>
        <InputGroup>
          <InputGroupAddon>@</InputGroupAddon>
          <TextInput id="specificSizeInputGroupUsername" placeholder="Username" />
        </InputGroup>
      </Col>
      <Col responsive={{ small: { span: 3 } }}>
        <FormLabel className="visually-hidden" htmlFor="specificSizeSelect">
          Preference
        </FormLabel>
        <Select id="specificSizeSelect">
          <option>Choose...</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Select>
      </Col>
      <Col span="auto">
        <Checkbox id="autoSizingCheck2" label="Remember me" />
      </Col>
      <Col span="auto">
        <Button type="submit">Submit</Button>
      </Col>
    </Form>
  )
}

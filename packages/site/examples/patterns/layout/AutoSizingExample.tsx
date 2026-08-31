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
    <Form className="row gy-2 gx-3 align-items-center">
      <Col span="auto">
        <FormLabel className="visually-hidden" htmlFor="autoSizingInput">
          Name
        </FormLabel>
        <TextInput id="autoSizingInput" placeholder="Jane Doe" />
      </Col>
      <Col span="auto">
        <FormLabel className="visually-hidden" htmlFor="autoSizingInputGroup">
          Username
        </FormLabel>
        <InputGroup>
          <InputGroupAddon>@</InputGroupAddon>
          <TextInput id="autoSizingInputGroup" placeholder="Username" />
        </InputGroup>
      </Col>
      <Col span="auto">
        <FormLabel className="visually-hidden" htmlFor="autoSizingSelect">
          Preference
        </FormLabel>
        <Select id="autoSizingSelect">
          <option>Choose...</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Select>
      </Col>
      <Col span="auto">
        <Checkbox id="autoSizingCheck" label="Remember me" />
      </Col>
      <Col span="auto">
        <Button type="submit">Submit</Button>
      </Col>
    </Form>
  )
}

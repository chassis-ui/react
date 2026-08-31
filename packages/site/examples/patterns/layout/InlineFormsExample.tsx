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
    <Form className="row large:row-cols-auto g-3 align-items-center">
      <Col span={12}>
        <FormLabel className="visually-hidden" htmlFor="inlineFormInputGroupUsername">
          Username
        </FormLabel>
        <InputGroup>
          <InputGroupAddon>@</InputGroupAddon>
          <TextInput id="inlineFormInputGroupUsername" placeholder="Username" />
        </InputGroup>
      </Col>
      <Col span={12}>
        <FormLabel className="visually-hidden" htmlFor="inlineFormSelectPref">
          Preference
        </FormLabel>
        <Select id="inlineFormSelectPref">
          <option>Choose...</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Select>
      </Col>
      <Col span={12}>
        <Checkbox id="inlineFormCheck" label="Remember me" />
      </Col>
      <Col span={12}>
        <Button type="submit">Submit</Button>
      </Col>
    </Form>
  )
}

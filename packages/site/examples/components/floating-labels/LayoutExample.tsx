import { Col, FloatingInput, Row, Select, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Row gutter="small">
      <Col responsive={{ medium: { span: true } }}>
        <FloatingInput label="Email address" ids={{ input: 'floatingInputGrid' }}>
          <TextInput
            type="email"
            id="floatingInputGrid"
            placeholder="name@example.com"
            defaultValue="email@example.com"
          />
        </FloatingInput>
      </Col>
      <Col responsive={{ medium: { span: true } }}>
        <FloatingInput label="Works with selects" ids={{ input: 'floatingSelectGrid' }}>
          <Select id="floatingSelectGrid">
            <option>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Select>
        </FloatingInput>
      </Col>
    </Row>
  )
}

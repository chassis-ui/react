import { Col, Row, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Row>
      <Col span>
        <TextInput placeholder="First name" aria-label="First name" />
      </Col>
      <Col span>
        <TextInput placeholder="Last name" aria-label="Last name" />
      </Col>
    </Row>
  )
}

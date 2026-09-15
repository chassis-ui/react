import { Col, Row, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Row className="g-3">
      <Col responsive={{ sm: { span: 7 } }}>
        <TextInput placeholder="City" aria-label="City" />
      </Col>
      <Col responsive={{ sm: { span: true } }}>
        <TextInput placeholder="State" aria-label="State" />
      </Col>
      <Col responsive={{ sm: { span: true } }}>
        <TextInput placeholder="Zip" aria-label="Zip" />
      </Col>
    </Row>
  )
}

import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col span={8} responsive={{ medium: { span: true } }}>
          Two-thirds width below medium, then equal width alongside its sibling
        </Col>
        <Col span={4} responsive={{ medium: { span: true } }}>
          One-third width below medium, then equal width alongside its sibling
        </Col>
      </Row>
    </Container>
  )
}

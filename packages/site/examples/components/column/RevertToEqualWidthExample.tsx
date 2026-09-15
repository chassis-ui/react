import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col span={8} responsive={{ md: { span: true } }}>
          Two-thirds width below md, then equal width alongside its sibling
        </Col>
        <Col span={4} responsive={{ md: { span: true } }}>
          One-third width below md, then equal width alongside its sibling
        </Col>
      </Row>
    </Container>
  )
}

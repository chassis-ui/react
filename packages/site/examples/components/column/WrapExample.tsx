import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col span={9}>Nine columns wide</Col>
        <Col span={4}>Four columns wide — wraps to a new line since 9 + 4 exceeds 12</Col>
        <Col span={6}>Six columns wide — continues on the wrapped line</Col>
      </Row>
    </Container>
  )
}

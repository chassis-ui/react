import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col span={8}>Two-thirds width</Col>
        <Col span={4}>One-third width</Col>
      </Row>
    </Container>
  )
}

import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col span={6}>First column</Col>
        <Col span={6}>Second column</Col>
        <div className="w-100" />
        <Col span={6}>Third column, forced onto a new line</Col>
        <Col span={6}>Fourth column</Col>
      </Row>
    </Container>
  )
}

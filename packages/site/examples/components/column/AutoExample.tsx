import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col span="auto">Sized to content</Col>
        <Col>Fills the remaining width</Col>
      </Row>
    </Container>
  )
}

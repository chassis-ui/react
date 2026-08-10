import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col order="last">First in the DOM, ordered last</Col>
        <Col>Second in the DOM, unordered</Col>
        <Col order="first">Third in the DOM, ordered first</Col>
      </Row>
    </Container>
  )
}

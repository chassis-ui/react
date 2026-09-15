import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row cols={2} gutter="sm" responsive={{ lg: { cols: 5, gutter: 'md' } }}>
        <Col>
          <div className="border p-md text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-md text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-md text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-md text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-md text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-md text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-md text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-md text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-md text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-md text-center">Row column</div>
        </Col>
      </Row>
    </Container>
  )
}

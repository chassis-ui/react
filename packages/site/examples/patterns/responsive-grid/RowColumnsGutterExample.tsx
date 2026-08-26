import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row cols={2} gutter="small" responsive={{ large: { cols: 5, gutter: 'medium' } }}>
        <Col>
          <div className="border p-medium text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-medium text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-medium text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-medium text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-medium text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-medium text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-medium text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-medium text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-medium text-center">Row column</div>
        </Col>
        <Col>
          <div className="border p-medium text-center">Row column</div>
        </Col>
      </Row>
    </Container>
  )
}

import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col responsive={{ md: { span: 8 } }}>.md:col-8</Col>
        <Col span={6} responsive={{ md: { span: 4 } }}>
          .col-6 .md:col-4
        </Col>
      </Row>
      <Row>
        <Col span={6} responsive={{ md: { span: 4 } }}>
          .col-6 .md:col-4
        </Col>
        <Col span={6} responsive={{ md: { span: 4 } }}>
          .col-6 .md:col-4
        </Col>
        <Col span={6} responsive={{ md: { span: 4 } }}>
          .col-6 .md:col-4
        </Col>
      </Row>
      <Row>
        <Col span={6}>.col-6</Col>
        <Col span={6}>.col-6</Col>
      </Row>
    </Container>
  )
}

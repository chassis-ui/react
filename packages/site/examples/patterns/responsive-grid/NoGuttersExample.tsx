import { Col, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="docs-example-row">
      <Row gutter={0}>
        <Col responsive={{ sm: { span: 6 }, md: { span: 8 } }}>.sm:col-6 .md:col-8</Col>
        <Col span={6} responsive={{ md: { span: 4 } }}>
          .col-6 .md:col-4
        </Col>
      </Row>
    </div>
  )
}

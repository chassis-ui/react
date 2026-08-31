import { Col, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="docs-example-row">
      <Row gutter={0}>
        <Col responsive={{ small: { span: 6 }, medium: { span: 8 } }}>
          .small:col-6 .medium:col-8
        </Col>
        <Col span={6} responsive={{ medium: { span: 4 } }}>
          .col-6 .medium:col-4
        </Col>
      </Row>
    </div>
  )
}

import { Col } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Col span={3}>One-quarter width</Col>
      <Col responsive={{ sm: { span: 9 } }}>
        Full width, then three-quarters above the sm breakpoint
      </Col>
    </>
  )
}

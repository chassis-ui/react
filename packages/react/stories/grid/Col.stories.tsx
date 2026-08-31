import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Col } from '../../src/components/grid/Col'
import { Row } from '../../src/components/grid/Row'
import { Container } from '../../src/components/grid/Container'

const meta: Meta<typeof Col> = {
  component: Col,
  title: 'grid/Col'
}
export default meta

type Story = StoryObj<typeof Col>

const boxClass = 'border p-medium text-center'

export const Span: Story = {
  render: () => (
    <Container>
      <Row>
        <Col span={8} className={boxClass}>
          span=8
        </Col>
        <Col span={4} className={boxClass}>
          span=4
        </Col>
      </Row>
    </Container>
  )
}

export const ResponsiveSpan: Story = {
  render: () => (
    <Container>
      <Row>
        <Col span={6} responsive={{ small: { span: 4 } }} className={boxClass}>
          span=6, small:span=4
        </Col>
        <Col span={6} responsive={{ small: { span: 4 } }} className={boxClass}>
          span=6, small:span=4
        </Col>
        <Col span={6} responsive={{ small: { span: 4 } }} className={boxClass}>
          span=6, small:span=4
        </Col>
      </Row>
    </Container>
  )
}

export const Offset: Story = {
  render: () => (
    <Container>
      <Row>
        <Col responsive={{ medium: { span: 4 } }} className={boxClass}>
          medium:span=4
        </Col>
        <Col responsive={{ medium: { span: 4, offset: 4 } }} className={boxClass}>
          medium:span=4 medium:offset=4
        </Col>
      </Row>
    </Container>
  )
}

export const Order: Story = {
  render: () => (
    <Container>
      <Row>
        <Col span order="last" className={boxClass}>
          First in DOM, ordered last
        </Col>
        <Col className={boxClass}>Second in DOM, unordered</Col>
        <Col span order="first" className={boxClass}>
          Third in DOM, ordered first
        </Col>
      </Row>
    </Container>
  )
}

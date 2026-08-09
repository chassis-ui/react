import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Col } from '../../components/grid/Col'
import { Row } from '../../components/grid/Row'
import { Container } from '../../components/grid/Container'

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
        <Col xs={8} className={boxClass}>
          xs=8
        </Col>
        <Col xs={4} className={boxClass}>
          xs=4
        </Col>
      </Row>
    </Container>
  )
}

export const ResponsiveSpan: Story = {
  render: () => (
    <Container>
      <Row>
        <Col xs={6} sm={4} className={boxClass}>
          xs=6 sm=4
        </Col>
        <Col xs={6} sm={4} className={boxClass}>
          xs=6 sm=4
        </Col>
        <Col xs={6} sm={4} className={boxClass}>
          xs=6 sm=4
        </Col>
      </Row>
    </Container>
  )
}

export const Offset: Story = {
  render: () => (
    <Container>
      <Row>
        <Col md={4} className={boxClass}>
          md=4
        </Col>
        <Col md={{ span: 4, offset: 4 }} className={boxClass}>
          md=4 offset=4
        </Col>
      </Row>
    </Container>
  )
}

export const Order: Story = {
  render: () => (
    <Container>
      <Row>
        <Col xs={{ span: true, order: 'last' }} className={boxClass}>
          First in DOM, ordered last
        </Col>
        <Col className={boxClass}>Second in DOM, unordered</Col>
        <Col xs={{ span: true, order: 'first' }} className={boxClass}>
          Third in DOM, ordered first
        </Col>
      </Row>
    </Container>
  )
}

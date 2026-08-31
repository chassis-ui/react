import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Row } from '../../src/components/grid/Row'
import { Col } from '../../src/components/grid/Col'
import { Container } from '../../src/components/grid/Container'

const meta: Meta<typeof Row> = {
  component: Row,
  title: 'grid/Row'
}
export default meta

type Story = StoryObj<typeof Row>

const boxClass = 'border p-medium text-center'

export const EqualWidth: Story = {
  render: () => (
    <Container>
      <Row>
        <Col className={boxClass}>1 of 3</Col>
        <Col className={boxClass}>2 of 3</Col>
        <Col className={boxClass}>3 of 3</Col>
      </Row>
    </Container>
  )
}

export const RowCols: Story = {
  render: () => (
    <Container>
      <Row cols={3}>
        <Col className={boxClass}>Column</Col>
        <Col className={boxClass}>Column</Col>
        <Col className={boxClass}>Column</Col>
        <Col className={boxClass}>Column</Col>
        <Col className={boxClass}>Column</Col>
        <Col className={boxClass}>Column</Col>
      </Row>
    </Container>
  )
}

export const ResponsiveRowCols: Story = {
  render: () => (
    <Container>
      <Row cols={1} responsive={{ small: { cols: 2 }, medium: { cols: 4 } }}>
        <Col className={boxClass}>Column</Col>
        <Col className={boxClass}>Column</Col>
        <Col className={boxClass}>Column</Col>
        <Col className={boxClass}>Column</Col>
      </Row>
    </Container>
  )
}

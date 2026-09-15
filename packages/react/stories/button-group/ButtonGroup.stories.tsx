import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../src/components/button/Button'
import { ButtonGroup } from '../../src/components/button-group/ButtonGroup'
import { ButtonToolbar } from '../../src/components/button-group/ButtonToolbar'

const meta: Meta<typeof ButtonGroup> = {
  component: ButtonGroup,
  title: 'button-group/ButtonGroup'
}

export default meta

type Story = StoryObj<typeof ButtonGroup>

export const Default: Story = {
  render: () => (
    <ButtonGroup role="group" aria-label="Basic example">
      <Button color="primary">Left</Button>
      <Button color="primary">Middle</Button>
      <Button color="primary">Right</Button>
    </ButtonGroup>
  )
}

export const Outlined: Story = {
  render: () => (
    <ButtonGroup role="group" aria-label="Basic outlined example">
      <Button color="primary" variant="outline">
        Left
      </Button>
      <Button color="primary" variant="outline">
        Middle
      </Button>
      <Button color="primary" variant="outline">
        Right
      </Button>
    </ButtonGroup>
  )
}

export const Sizes: Story = {
  render: () => (
    <>
      <ButtonGroup size="lg" role="group" aria-label="Large button group">
        <Button variant="outline">Left</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
      <ButtonGroup size="sm" role="group" aria-label="Small button group">
        <Button variant="outline">Left</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
    </>
  )
}

export const Vertical: Story = {
  render: () => (
    <ButtonGroup vertical role="group" aria-label="Vertical button group">
      <Button color="black">Button</Button>
      <Button color="black">Button</Button>
      <Button color="black">Button</Button>
    </ButtonGroup>
  )
}

export const Toolbar: Story = {
  render: () => (
    <ButtonToolbar role="group" aria-label="Toolbar with button groups">
      <ButtonGroup className="me-sm" role="group" aria-label="First group">
        <Button color="primary">1</Button>
        <Button color="primary">2</Button>
      </ButtonGroup>
      <ButtonGroup role="group" aria-label="Second group">
        <Button color="secondary">3</Button>
      </ButtonGroup>
    </ButtonToolbar>
  )
}

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../src/components/button/Button'
import { InputGroup } from '../../src/components/input-group/InputGroup'
import { InputGroupAddon } from '../../src/components/input-group/InputGroupAddon'
import { TextInput } from '../../src/components/text-input/TextInput'

const meta: Meta<typeof InputGroup> = {
  component: InputGroup,
  title: 'input-group/InputGroup'
}

export default meta

type Story = StoryObj<typeof InputGroup>

export const Default: Story = {
  render: () => (
    <>
      <InputGroup className="mb-md">
        <InputGroupAddon id="basic-addon1">@</InputGroupAddon>
        <TextInput placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>$</InputGroupAddon>
        <TextInput aria-label="Amount (to the nearest dollar)" />
        <InputGroupAddon>.00</InputGroupAddon>
      </InputGroup>
    </>
  )
}

export const ButtonAddons: Story = {
  render: () => (
    <>
      <InputGroup className="mb-md">
        <Button type="button" color="secondary" variant="outline" id="button-addon1">
          Button
        </Button>
        <TextInput aria-label="Example text with button addon" aria-describedby="button-addon1" />
      </InputGroup>
      <InputGroup>
        <TextInput
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby="button-addon2"
        />
        <Button type="button" color="secondary" variant="outline" id="button-addon2">
          Button
        </Button>
      </InputGroup>
    </>
  )
}

export const Sizes: Story = {
  render: () => (
    <>
      <InputGroup size="sm" className="mb-md">
        <InputGroupAddon id="inputGroup-sizing-sm">Small</InputGroupAddon>
        <TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
      </InputGroup>
      <InputGroup className="mb-md">
        <InputGroupAddon id="inputGroup-sizing-default">Default</InputGroupAddon>
        <TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
      </InputGroup>
      <InputGroup size="lg">
        <InputGroupAddon id="inputGroup-sizing-lg">Large</InputGroupAddon>
        <TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" />
      </InputGroup>
    </>
  )
}

export const MultipleInputs: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon>First and last name</InputGroupAddon>
      <TextInput aria-label="First name" />
      <TextInput aria-label="Last name" />
    </InputGroup>
  )
}

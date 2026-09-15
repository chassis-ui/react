import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Button } from '../../src/components/button/Button'
import { Checkbox } from '../../src/components/checkbox/Checkbox'
import { Col } from '../../src/components/grid/Col'
import { Row } from '../../src/components/grid/Row'
import { Form } from '../../src/components/form/Form'
import { FormHelp } from '../../src/components/form/FormHelp'
import { FormLabel } from '../../src/components/form/FormLabel'
import { Select } from '../../src/components/select/Select'
import { TextInput } from '../../src/components/text-input/TextInput'

const meta: Meta<typeof Form> = {
  component: Form,
  title: 'form/Form'
}

export default meta

type Story = StoryObj<typeof Form>

export const Default: Story = {
  args: {
    onSubmit: fn((event) => event.preventDefault())
  },
  render: (args) => (
    <Form {...args}>
      <div className="mb-md">
        <FormLabel htmlFor="exampleInputEmail1">Email address</FormLabel>
        <TextInput type="email" id="exampleInputEmail1" aria-describedby="emailHelp" />
        <FormHelp id="emailHelp">We&apos;ll never share your email with anyone else.</FormHelp>
      </div>
      <div className="mb-md">
        <FormLabel htmlFor="exampleInputPassword1">Password</FormLabel>
        <TextInput type="password" id="exampleInputPassword1" />
      </div>
      <Checkbox className="mb-md" label="Check me out" />
      <Button type="submit" color="primary">
        Submit
      </Button>
    </Form>
  ),
  play: async function ({ args, canvas, userEvent }) {
    const submit = canvas.getByRole('button', { name: /submit/i })
    await userEvent.click(submit)
    await expect(args.onSubmit).toHaveBeenCalled()
  }
}

export const BlockHelp: Story = {
  render: () => (
    <Form>
      <div className="mb-md">
        <FormLabel htmlFor="inputPassword5">Password</FormLabel>
        <TextInput type="password" id="inputPassword5" aria-describedby="passwordHelpBlock" />
        <FormHelp id="passwordHelpBlock">
          Your password must be 8-20 characters long, contain letters and numbers, and must not
          contain spaces, special characters, or emoji.
        </FormHelp>
      </div>
    </Form>
  )
}

export const InlineHelp: Story = {
  render: () => (
    <Row className="g-3 align-items-center">
      <Col span="auto">
        <FormLabel htmlFor="inputPassword6" className="col-form-label">
          Password
        </FormLabel>
      </Col>
      <Col span="auto">
        <TextInput type="password" id="inputPassword6" aria-describedby="passwordHelpInline" />
      </Col>
      <Col span="auto">
        <FormHelp component="span" id="passwordHelpInline">
          Must be 8-20 characters long.
        </FormHelp>
      </Col>
    </Row>
  )
}

export const DisabledFieldset: Story = {
  render: () => (
    <Form>
      <fieldset disabled>
        <legend>Disabled fieldset example</legend>
        <div className="mb-md">
          <FormLabel htmlFor="disabledTextInput">Disabled input</FormLabel>
          <TextInput id="disabledTextInput" placeholder="Disabled input" />
        </div>
        <div className="mb-md">
          <FormLabel htmlFor="disabledSelect">Disabled select menu</FormLabel>
          <Select id="disabledSelect">
            <option>Disabled select</option>
          </Select>
        </div>
        <div className="mb-md">
          <Checkbox id="disabledFieldsetCheck" label="Can't check this" disabled />
        </div>
        <Button type="submit">Submit</Button>
      </fieldset>
    </Form>
  )
}

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, spyOn } from 'storybook/test'

import { Button } from '../../src/components/button/Button'
import { Checkbox } from '../../src/components/checkbox/Checkbox'
import { Flex } from '../../src/components/flex/Flex'
import { Form } from '../../src/components/form/Form'
import { FormHelp } from '../../src/components/form/FormHelp'
import { FormLabel } from '../../src/components/form/FormLabel'
import { Select } from '../../src/components/select/Select'
import { TextInput } from '../../src/components/text-input/TextInput'
import { TimeField } from '../../src/components/time-field/TimeField'

// react-aria warns about a field it finds no label on, and it reads the field's own
// `aria-label`/`aria-labelledby` only: a `<label for>` alone names the field and still warns
// (FORMS.md, gotcha 5). A `TextInput` below takes its own `label`, or names a hand-written
// `FormLabel` through `aria-labelledby` as well, and its story fails if the warning comes back.
const LABEL_WARNING = 'If you do not provide a visible label'

const meta: Meta<typeof Form> = {
  beforeEach: () => {
    const warn = spyOn(console, 'warn')
    return () => warn.mockRestore()
  },
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
        <TextInput
          type="email"
          label="Email address"
          help="We'll never share your email with anyone else."
        />
      </div>
      <div className="mb-md">
        <TextInput type="password" label="Password" />
      </div>
      <Checkbox className="mb-md" label="Check me out" />
      <Button type="submit" color="primary">
        Submit
      </Button>
    </Form>
  ),
  play: async function ({ args, canvas, userEvent }) {
    const email = canvas.getByRole('textbox', { name: 'Email address' })
    await expect(email).toHaveAccessibleDescription(
      "We'll never share your email with anyone else."
    )
    // A password input has no role to query by.
    await expect(canvas.getByLabelText('Password')).toHaveAccessibleName('Password')
    await expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining(LABEL_WARNING))
    const submit = canvas.getByRole('button', { name: /submit/i })
    await userEvent.click(submit)
    await expect(args.onSubmit).toHaveBeenCalled()
  }
}

export const BlockHelp: Story = {
  render: () => (
    <Form>
      <div className="mb-md">
        <FormLabel htmlFor="inputPassword5" id="inputPassword5Label">
          Password
        </FormLabel>
        <TextInput
          type="password"
          id="inputPassword5"
          aria-describedby="passwordHelpBlock"
          aria-labelledby="inputPassword5Label"
        />
        <FormHelp id="passwordHelpBlock">
          Your password must be 8-20 characters long, contain letters and numbers, and must not
          contain spaces, special characters, or emoji.
        </FormHelp>
      </div>
    </Form>
  ),
  play: async function ({ canvas }) {
    const input = canvas.getByLabelText('Password')
    await expect(input).toHaveAccessibleName('Password')
    await expect(input).toHaveAccessibleDescription(/must be 8-20 characters long/)
    await expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining(LABEL_WARNING))
  }
}

export const InlineHelp: Story = {
  render: () => (
    <Flex wrap="wrap" gap="md" align="center">
      <div>
        <FormLabel htmlFor="inputPassword6" id="inputPassword6Label" className="col-form-label">
          Password
        </FormLabel>
      </div>
      <div>
        <TextInput
          type="password"
          id="inputPassword6"
          aria-describedby="passwordHelpInline"
          aria-labelledby="inputPassword6Label"
        />
      </div>
      <div>
        <FormHelp component="span" id="passwordHelpInline">
          Must be 8-20 characters long.
        </FormHelp>
      </div>
    </Flex>
  ),
  play: async function ({ canvas }) {
    const input = canvas.getByLabelText('Password')
    await expect(input).toHaveAccessibleName('Password')
    await expect(input).toHaveAccessibleDescription('Must be 8-20 characters long.')
    await expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining(LABEL_WARNING))
  }
}

// The validation state chassis-css gives a control, read from the `--cx-border-color` its state
// rules set. A custom property isn't transitioned, so it holds the final value at once, where the
// border colour itself would still be on its way.
const validationState = (element: Element) => {
  const style = getComputedStyle(element)
  const border = style.getPropertyValue('--cx-border-color').trim()
  if (border === style.getPropertyValue('--cx-form-invalid-border-color').trim()) return 'invalid'
  if (border === style.getPropertyValue('--cx-form-valid-border-color').trim()) return 'valid'
  return 'none'
}

const ValidatedForm = () => {
  const [validated, setValidated] = React.useState(false)
  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={(event) => {
        event.preventDefault()
        setValidated(true)
      }}
    >
      <div className="mb-md">
        <TextInput label="First name" defaultValue="Mark" validFeedback="Looks good!" required />
      </div>
      <div className="mb-md">
        <TextInput label="City" invalidFeedback="Please provide a valid city." required />
      </div>
      <div className="mb-md">
        <Select
          label="State"
          defaultValue=""
          invalidFeedback="Please select a valid state."
          required
        >
          <option disabled value="">
            Choose...
          </option>
          <option>California</option>
        </Select>
      </div>
      <div className="mb-md">
        <TimeField label="Opening time" invalidFeedback="Please give a time." required />
      </div>
      <Checkbox className="mb-md" label="Agree to terms and conditions" required />
      <Button type="submit" color="primary">
        Submit
      </Button>
    </Form>
  )
}

export const Validated: Story = {
  render: () => <ValidatedForm />,
  play: async function ({ canvas, userEvent }) {
    const firstName = canvas.getByRole('textbox', { name: 'First name' })
    const city = canvas.getByRole('textbox', { name: 'City' })
    const state = canvas.getByRole('combobox', { name: 'State' })
    const time = canvas.getByRole('group', { name: 'Opening time' })
    const agree = canvas.getByRole('checkbox', { name: 'Agree to terms and conditions' })
    const controls = [firstName, city, state, time, agree]

    // Nothing shows a state before the user has tried to submit.
    await expect(controls.map(validationState)).toEqual(['none', 'none', 'none', 'none', 'none'])
    await expect(canvas.queryByText('Please provide a valid city.')).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))

    await expect(controls.map(validationState)).toEqual([
      'valid',
      'invalid',
      'invalid',
      'invalid',
      'invalid'
    ])
    await expect(canvas.getByText('Looks good!')).toBeVisible()
    await expect(canvas.getByText('Please provide a valid city.')).toBeVisible()
    await expect(canvas.getByText('Please give a time.')).toBeVisible()

    // A control follows its value from then on.
    await userEvent.type(city, 'Amsterdam')
    await expect(validationState(city)).toBe('valid')
    await expect(canvas.queryByText('Please provide a valid city.')).not.toBeInTheDocument()
    await userEvent.click(agree)
    await expect(validationState(agree)).toBe('valid')
  }
}

export const DisabledFieldset: Story = {
  render: () => (
    <Form>
      <fieldset disabled>
        <legend>Disabled fieldset example</legend>
        <div className="mb-md">
          <TextInput label="Disabled input" placeholder="Disabled input" />
        </div>
        <div className="mb-md">
          <Select label="Disabled select menu">
            <option>Disabled select</option>
          </Select>
        </div>
        <div className="mb-md">
          <Checkbox id="disabledFieldsetCheck" label="Can't check this" disabled />
        </div>
        <Button type="submit">Submit</Button>
      </fieldset>
    </Form>
  ),
  play: async function ({ canvas }) {
    await expect(canvas.getByRole('textbox', { name: 'Disabled input' })).toBeDisabled()
    await expect(canvas.getByRole('combobox', { name: 'Disabled select menu' })).toBeDisabled()
    await expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining(LABEL_WARNING))
  }
}

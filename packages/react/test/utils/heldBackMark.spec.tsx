import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent, { UserEvent } from '@testing-library/user-event'
import { axe } from 'jest-axe'

import {
  Checkbox,
  CheckboxGroup,
  ChipInput,
  Combobox,
  ComboboxItem,
  FileInput,
  Form,
  NumberField,
  OtpInput,
  Radio,
  RadioGroup,
  SearchField,
  Select,
  Switch,
  Textarea,
  TextInput
} from '../../src/index'

// A form with an invalid control isn't submitted, and a browser says why beside the first such
// control. react-aria cancels that message for every control its hooks are given and focuses the
// control instead: the form stayed and nothing said why. Every field shows itself as invalid from
// that submit until it no longer holds the form back (`src/hooks/useHeldBack.ts`): the ones a
// react-aria hook backs, and the native leaves, whose message is beside the first invalid control
// alone. The fields whose value is in an input that isn't displayed (`TimeField`, the date
// pickers, `Autocomplete`) do the same through `useRequiredValueInput`, and their own specs
// cover it. `ColorInput` and `RangeInput` always have a value, and hold nothing back.
//
// A `Form` with `validated` shows each field the same way with no submit, and as valid once it
// would let the form submit (`Form.spec.tsx` covers the fields of `useRequiredValueInput`).
//
// A new form component gets a row here.

const FEEDBACK = 'This is needed.'
const GOOD = 'Looks good.'

interface Field {
  name: string
  /** The props that say what is missing, for a field that takes a message. */
  feedback?: Record<string, string>
  /** The field, required and empty, with `props` over it. */
  ui: (props: Record<string, unknown>) => React.ReactElement
  /** The element that states the invalid state to assistive technology. */
  marked: () => HTMLElement
  /** Gives the field a value, as a user does. */
  fill: (user: UserEvent) => Promise<void>
  /** Types what isn't a value yet, for a field whose text isn't its value. */
  begin?: (user: UserEvent) => Promise<void>
  /**
   * Why the case can't check what follows a value, where jsdom can't give the field one a form
   * sees.
   */
  cannotFill?: string
  /** Why the case skips axe, for a violation the field has whatever its state. */
  skipsAxe?: string
}

const fields: Field[] = [
  {
    name: 'TextInput',
    feedback: { invalidFeedback: FEEDBACK },
    ui: (props) => <TextInput label="Name" name="field" required {...props} />,
    marked: () => screen.getByRole('textbox', { name: 'Name' }),
    fill: (user) => user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada')
  },
  {
    name: 'Textarea',
    feedback: { invalidFeedback: FEEDBACK },
    ui: (props) => <Textarea label="Notes" name="field" required {...props} />,
    marked: () => screen.getByRole('textbox', { name: 'Notes' }),
    fill: (user) => user.type(screen.getByRole('textbox', { name: 'Notes' }), 'Ada')
  },
  {
    name: 'SearchField',
    feedback: { invalidFeedback: FEEDBACK },
    ui: (props) => <SearchField label="Query" name="field" required {...props} />,
    marked: () => screen.getByRole('searchbox', { name: 'Query' }),
    fill: (user) => user.type(screen.getByRole('searchbox', { name: 'Query' }), 'Ada')
  },
  {
    name: 'NumberField',
    feedback: { invalidFeedback: FEEDBACK },
    ui: (props) => <NumberField label="Quantity" name="field" required {...props} />,
    marked: () => screen.getByRole('textbox', { name: 'Quantity' }),
    fill: (user) => user.type(screen.getByRole('textbox', { name: 'Quantity' }), '5')
  },
  {
    name: 'Combobox',
    feedback: { invalidFeedback: FEEDBACK },
    ui: (props) => (
      <Combobox label="Fruit" name="field" required {...props}>
        <ComboboxItem id="apple">Apple</ComboboxItem>
        <ComboboxItem id="pear">Pear</ComboboxItem>
      </Combobox>
    ),
    marked: () => screen.getByRole('combobox', { name: 'Fruit' }),
    begin: (user) => user.type(screen.getByRole('combobox', { name: 'Fruit' }), 'Pe'),
    fill: async (user) => {
      await user.click(screen.getByRole('combobox', { name: 'Fruit' }))
      await user.click(await screen.findByRole('option', { name: 'Pear' }))
    }
  },
  {
    name: 'OtpInput',
    feedback: { invalidFeedback: FEEDBACK },
    ui: (props) => <OtpInput label="Code" length={2} name="field" required {...props} />,
    marked: () => screen.getByRole('textbox', { name: 'Digit 1' }),
    fill: async (user) => {
      await user.type(screen.getByRole('textbox', { name: 'Digit 1' }), '1')
      await user.type(screen.getByRole('textbox', { name: 'Digit 2' }), '2')
    }
  },
  {
    name: 'ChipInput',
    feedback: { invalidFeedback: FEEDBACK },
    ui: (props) => <ChipInput label="Tags" name="field" required {...props} />,
    marked: () => screen.getByRole('textbox', { name: 'Tags' }),
    begin: (user) => user.type(screen.getByRole('textbox', { name: 'Tags' }), 'ne'),
    fill: (user) => user.type(screen.getByRole('textbox', { name: 'Tags' }), 'new{Enter}')
  },
  {
    name: 'Checkbox',
    ui: (props) => <Checkbox label="Terms" name="field" required {...props} />,
    marked: () => screen.getByRole('checkbox', { name: 'Terms' }),
    fill: (user) => user.click(screen.getByRole('checkbox', { name: 'Terms' }))
  },
  {
    name: 'Switch',
    ui: (props) => <Switch label="Terms" name="field" required {...props} />,
    marked: () => screen.getByRole('switch', { name: 'Terms' }),
    fill: (user) => user.click(screen.getByRole('switch', { name: 'Terms' }))
  },
  {
    name: 'Switch, radio-backed',
    ui: (props) => <Switch label="Terms" name="field" required type="radio" {...props} />,
    marked: () => screen.getByRole('switch', { name: 'Terms' }),
    fill: (user) => user.click(screen.getByRole('switch', { name: 'Terms' }))
  },
  {
    name: 'Select',
    feedback: { invalidFeedback: FEEDBACK },
    // Uncontrolled: the select keeps its own value, and no render follows a choice.
    ui: (props) => (
      <Select defaultValue="" label="State" name="field" required {...props}>
        <option disabled value="">
          Choose
        </option>
        <option value="ca">California</option>
      </Select>
    ),
    marked: () => screen.getByRole('combobox', { name: 'State' }),
    fill: (user) => user.selectOptions(screen.getByRole('combobox', { name: 'State' }), 'ca')
  },
  {
    name: 'FileInput',
    feedback: { invalidFeedback: FEEDBACK },
    ui: (props) => <FileInput label="Report" name="field" required {...props} />,
    marked: () => screen.getByLabelText('Report'),
    fill: (user) =>
      user.upload(
        screen.getByLabelText('Report'),
        new File(['a'], 'report.txt', { type: 'text/plain' })
      ),
    cannotFill: "user-event puts the file on the element, and jsdom's validity reads its own list"
  },
  {
    name: 'RadioGroup',
    feedback: { errorMessage: FEEDBACK },
    ui: (props) => (
      <RadioGroup label="Plan" name="field" required {...props}>
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>
    ),
    marked: () => screen.getByRole('radiogroup', { name: 'Plan' }),
    fill: (user) => user.click(screen.getByRole('radio', { name: 'Pro' }))
  },
  {
    name: 'CheckboxGroup',
    feedback: { errorMessage: FEEDBACK },
    ui: (props) => (
      <CheckboxGroup label="Channels" name="field" required {...props}>
        <Checkbox value="email" label="Email" />
        <Checkbox value="sms" label="SMS" />
      </CheckboxGroup>
    ),
    marked: () => screen.getByRole('checkbox', { name: 'Email' }),
    fill: (user) => user.click(screen.getByRole('checkbox', { name: 'SMS' }))
  }
]

const Order = ({ children, onSubmit }: { children: React.ReactNode; onSubmit: () => void }) => (
  <form
    aria-label="Order"
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit()
    }}
  >
    {children}
    <button type="submit">Save</button>
  </form>
)

const save = () => screen.getByRole('button', { name: 'Save' })

describe.each(fields)(
  '$name, held back by a submit',
  ({ cannotFill, feedback, fill, marked, skipsAxe, ui }) => {
    test('says nothing before a submit', () => {
      render(<Order onSubmit={() => undefined}>{ui({ ...feedback })}</Order>)
      expect(marked()).not.toHaveAttribute('aria-invalid')
      expect(screen.queryByText(FEEDBACK)).not.toBeInTheDocument()
    })

    test('shows as invalid, with its message, until it has a value', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      const { container } = render(<Order onSubmit={onSubmit}>{ui({ ...feedback })}</Order>)

      await user.click(save())
      expect(onSubmit).not.toHaveBeenCalled()
      expect(marked()).toHaveAttribute('aria-invalid', 'true')
      if (feedback) expect(screen.getByText(FEEDBACK)).toBeVisible()
      if (!skipsAxe) expect(await axe(container)).toHaveNoViolations()
      if (cannotFill) return

      await fill(user)
      expect(marked()).not.toHaveAttribute('aria-invalid')
      expect(screen.queryByText(FEEDBACK)).not.toBeInTheDocument()

      await user.click(save())
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    test("clears on the form's reset", async () => {
      const user = userEvent.setup()
      render(<Order onSubmit={() => undefined}>{ui({ ...feedback })}</Order>)

      await user.click(save())
      expect(marked()).toHaveAttribute('aria-invalid', 'true')

      act(() => screen.getByRole<HTMLFormElement>('form', { name: 'Order' }).reset())
      expect(marked()).not.toHaveAttribute('aria-invalid')
      expect(screen.queryByText(FEEDBACK)).not.toBeInTheDocument()
    })

    test.each([
      ['invalid={false}', { invalid: false }],
      ['valid', { valid: true }]
    ])('leaves the look to a caller who set %s', async (_prop, props) => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<Order onSubmit={onSubmit}>{ui({ ...feedback, ...props })}</Order>)

      await user.click(save())
      expect(onSubmit).not.toHaveBeenCalled()
      expect(marked()).not.toHaveAttribute('aria-invalid')
      expect(screen.queryByText(FEEDBACK)).not.toBeInTheDocument()
    })
  }
)

// The custom validity that says typed text isn't a value was set after the hook had read the
// input's validity: the first character typed into the empty field cleared the mark.
describe.each(fields.filter((field) => field.begin))(
  '$name, held back by a submit, while what is typed is not a value',
  ({ begin, feedback, marked, ui }) => {
    test('stays invalid', async () => {
      const user = userEvent.setup()
      render(<Order onSubmit={() => undefined}>{ui({ ...feedback })}</Order>)

      await user.click(save())
      await begin!(user)
      expect(marked()).toHaveAttribute('aria-invalid', 'true')
      if (feedback) expect(screen.getByText(FEEDBACK)).toBeVisible()
    })
  }
)

// What a validated form shows: the message that says the field is fine, where the field takes one.
const validatedProps = (feedback?: Record<string, string>) =>
  feedback?.invalidFeedback ? { ...feedback, validFeedback: GOOD } : { ...feedback }

describe.each(fields)(
  '$name, in a validated form',
  ({ cannotFill, feedback, fill, marked, ui }) => {
    test('shows as invalid with no submit, then as valid once it has a value', async () => {
      const user = userEvent.setup()
      render(
        <Form aria-label="Order" validated>
          {ui(validatedProps(feedback))}
        </Form>
      )

      expect(marked()).toHaveAttribute('aria-invalid', 'true')
      if (feedback) expect(screen.getByText(FEEDBACK)).toBeVisible()
      expect(screen.queryByText(GOOD)).not.toBeInTheDocument()
      if (cannotFill) return

      await fill(user)
      expect(marked()).not.toHaveAttribute('aria-invalid')
      expect(screen.queryByText(FEEDBACK)).not.toBeInTheDocument()
      if (feedback?.invalidFeedback) expect(screen.getByText(GOOD)).toBeVisible()
    })

    test('shows nothing once the form is no longer validated', () => {
      const { rerender } = render(
        <Form aria-label="Order" validated>
          {ui(validatedProps(feedback))}
        </Form>
      )
      expect(marked()).toHaveAttribute('aria-invalid', 'true')

      rerender(<Form aria-label="Order">{ui(validatedProps(feedback))}</Form>)
      expect(marked()).not.toHaveAttribute('aria-invalid')
      expect(screen.queryByText(FEEDBACK)).not.toBeInTheDocument()
    })

    test.each([
      ['invalid={false}', { invalid: false }],
      ['valid', { valid: true }]
    ])('leaves the look to a caller who set %s', (_prop, props) => {
      render(
        <Form aria-label="Order" validated>
          {ui({ ...validatedProps(feedback), ...props })}
        </Form>
      )
      expect(marked()).not.toHaveAttribute('aria-invalid')
      expect(screen.queryByText(FEEDBACK)).not.toBeInTheDocument()
    })

    // A server's answer the field's own constraints can't know of, such as a name that is taken.
    test('stays invalid with a value when the caller set invalid', async () => {
      if (cannotFill) return
      const user = userEvent.setup()
      render(
        <Form aria-label="Order" validated>
          {ui({ ...validatedProps(feedback), invalid: true })}
        </Form>
      )

      await fill(user)
      expect(marked()).toHaveAttribute('aria-invalid', 'true')
      expect(screen.queryByText(GOOD)).not.toBeInTheDocument()
    })
  }
)

describe.each(fields.filter((field) => field.begin))(
  '$name, in a validated form, while what is typed is not a value',
  ({ begin, feedback, marked, ui }) => {
    test('stays invalid', async () => {
      const user = userEvent.setup()
      render(
        <Form aria-label="Order" validated>
          {ui(validatedProps(feedback))}
        </Form>
      )

      await begin!(user)
      expect(marked()).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByText(FEEDBACK)).toBeVisible()
      expect(screen.queryByText(GOOD)).not.toBeInTheDocument()
    })
  }
)

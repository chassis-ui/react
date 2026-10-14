import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { CalendarDate, Time } from '@internationalized/date'
import { axe } from 'jest-axe'

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  ColorInput,
  DatePicker,
  DateRangePicker,
  Form,
  FormHelp,
  FormLabel,
  RangeInput,
  TextInput,
  TimeField
} from '../../../src/index'

const BAD = 'This is needed.'
const GOOD = 'Looks good.'
const feedback = { invalidFeedback: BAD, validFeedback: GOOD }

describe('Form', () => {
  describe('rendering', () => {
    test('renders a form element', () => {
      render(<Form aria-label="Sign up">Test</Form>)
      const form = screen.getByRole('form', { name: 'Sign up' })
      expect(form.tagName).toBe('FORM')
    })

    test('renders composed form field markup with the expected classes', () => {
      render(
        <Form>
          <FormLabel>A</FormLabel>
          <TextInput aria-describedby="B" aria-label="A" type="email" />
          <FormHelp>C</FormHelp>
          <Checkbox label="D" />
          <Button type="submit" color="primary">
            E
          </Button>
        </Form>
      )
      expect(screen.getByText('A')).toHaveClass('form-label')
      const input = screen.getByLabelText('A')
      expect(input).toHaveClass('form-input')
      expect(input).toHaveAttribute('type', 'email')
      expect(screen.getByText('E')).toHaveClass('button', 'primary')
    })

    // chassis-css has no rule for `.was-validated`: the fields show the state themselves.
    test('renders no class for validated, and keeps its className', () => {
      render(
        <Form aria-label="Sign up" className="bazinga" validated>
          Test
        </Form>
      )
      expect(screen.getByRole('form', { name: 'Sign up' })).toHaveAttribute('class', 'bazinga')
    })
  })

  // Every field with a native control is run through this in `test/utils/heldBackMark.spec.tsx`.
  // These are the ones whose value is in an input that isn't displayed (`useRequiredValueInput`),
  // and the two that always have a value.
  describe('validated', () => {
    describe.each([
      [
        'TimeField',
        (props: Record<string, unknown>) => <TimeField label="Field" {...props} />,
        { defaultValue: new Time(9, 30) }
      ],
      [
        'DatePicker',
        (props: Record<string, unknown>) => <DatePicker label="Field" {...props} />,
        { defaultValue: new CalendarDate(2024, 3, 15) }
      ],
      [
        'DateRangePicker',
        (props: Record<string, unknown>) => <DateRangePicker label="Field" {...props} />,
        {
          defaultValue: {
            end: new CalendarDate(2024, 3, 20),
            start: new CalendarDate(2024, 3, 15)
          }
        }
      ],
      [
        'Autocomplete',
        (props: Record<string, unknown>) => (
          <Autocomplete label="Field" {...props}>
            <AutocompleteItem id="apple">Apple</AutocompleteItem>
          </Autocomplete>
        ),
        { defaultValue: 'apple' }
      ]
    ])('%s', (_name, ui, filled) => {
      test('shows a required one with no value as invalid', () => {
        render(<Form validated>{ui({ ...feedback, required: true })}</Form>)
        expect(screen.getByText(BAD)).toBeVisible()
        expect(screen.queryByText(GOOD)).not.toBeInTheDocument()
      })

      test('shows a required one with its value as valid', () => {
        render(<Form validated>{ui({ ...feedback, ...filled, required: true })}</Form>)
        expect(screen.getByText(GOOD)).toBeVisible()
        expect(screen.queryByText(BAD)).not.toBeInTheDocument()
      })

      test('shows nothing outside a validated form', () => {
        render(<Form>{ui({ ...feedback, required: true })}</Form>)
        expect(screen.queryByText(BAD)).not.toBeInTheDocument()
        expect(screen.queryByText(GOOD)).not.toBeInTheDocument()
      })
    })

    test.each([
      ['ColorInput', <ColorInput key="color" label="Color" {...feedback} />],
      ['RangeInput', <RangeInput key="range" label="Volume" {...feedback} />]
    ])('shows a %s as valid', (_name, field) => {
      render(<Form validated>{field}</Form>)
      expect(screen.getByText(GOOD)).toBeVisible()
    })

    test('has no axe violations with invalid and valid fields', async () => {
      const { container } = render(
        <Form aria-label="Sign up" validated>
          <TextInput label="Name" defaultValue="Ada" required {...feedback} />
          <TextInput label="City" required {...feedback} />
          <TimeField label="Opening time" required {...feedback} />
          <Checkbox label="Agree" required />
        </Form>
      )
      expect(screen.getByRole('textbox', { name: 'City' })).toHaveAttribute('aria-invalid', 'true')
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying form', () => {
      const ref = React.createRef<HTMLFormElement>()
      render(<Form ref={ref}>Test</Form>)
      expect(ref.current).toBeInstanceOf(HTMLFormElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Form aria-label="Sign up">
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextInput aria-label="Email" id="email" type="email" />
        </Form>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

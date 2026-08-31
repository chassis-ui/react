import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Checkbox, CheckboxGroup } from '../../../src/index'

describe('Checkbox', () => {
  describe('rendering', () => {
    test('renders a bare check-input span with no label prop', () => {
      const { container } = render(<Checkbox aria-label="Accept terms" />)
      // The bare wrapper span has no role/name of its own - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('check-input')
      const input = screen.getByRole('checkbox')
      expect(input).toHaveAttribute('data-react-aria-pressable', 'true')
      expect(input).toHaveAttribute('tabindex', '0')
    })
  })

  describe('styling props', () => {
    test('applies color and className to the wrapper and check input', () => {
      const { container } = render(
        <Checkbox className="bazinga" color="secondary" id="id" label="label" />
      )
      // The form-check wrapper and check-input span are plain elements with no role/name -
      // no accessible query reaches them.
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('bazinga')
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('form-check')
      // eslint-disable-next-line testing-library/no-node-access
      const checkInput = screen.getByRole('checkbox').parentElement
      expect(checkInput).toHaveClass('check-input')
      expect(checkInput).toHaveClass('secondary')
    })

    test('renders the button variant classes on the wrapper', () => {
      const { container } = render(
        <Checkbox
          button={{ color: 'primary', size: 'large', shape: 'rounded', variant: 'ghost' }}
          className="bazinga"
          id="id"
          label="label"
        />
      )
      // Same unlabeled wrapper as above.
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('button')
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('button-check')
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('primary')
    })

    test('applies the invalid/valid class to the button-variant wrapper too', () => {
      const { container: invalidContainer } = render(
        <Checkbox button={{}} id="invalid-id" invalid label="label" />
      )
      // Same unlabeled wrapper as above.
      // eslint-disable-next-line testing-library/no-node-access
      expect(invalidContainer.firstChild).toHaveClass('is-invalid')

      const { container: validContainer } = render(
        <Checkbox button={{}} id="valid-id" label="label" valid />
      )
      // eslint-disable-next-line testing-library/no-node-access
      expect(validContainer.firstChild).toHaveClass('is-valid')
    })
  })

  describe('selection behavior', () => {
    test('an uncontrolled checkbox toggles on click and fires onChange(isSelected)', () => {
      const onChange = vi.fn()
      render(<Checkbox aria-label="Terms" defaultSelected={false} onChange={onChange} />)
      const input = screen.getByRole('checkbox')
      expect(input).not.toBeChecked()
      fireEvent.click(input)
      expect(input).toBeChecked()
      expect(onChange).toHaveBeenCalledWith(true)
    })

    test('a controlled checkbox reflects isSelected and fires onChange(isSelected) without changing itself', () => {
      const onChange = vi.fn()
      render(<Checkbox aria-label="Terms" isSelected={false} onChange={onChange} />)
      const input = screen.getByRole('checkbox')
      fireEvent.click(input)
      expect(onChange).toHaveBeenCalledWith(true)
      // Still false — the consumer owns the state and hasn't re-rendered with isSelected={true}.
      expect(input).not.toBeChecked()
    })

    test('indeterminate is synced onto the native input by the checkbox hook', () => {
      render(<Checkbox aria-label="Select all" indeterminate />)
      const input = screen.getByRole('checkbox') as HTMLInputElement
      expect(input.indeterminate).toBe(true)
    })

    test('inside a CheckboxGroup, selection is owned by the group and reported via its onChange', () => {
      const onChange = vi.fn()
      render(
        <CheckboxGroup aria-label="Notifications" defaultValue={['email']} onChange={onChange}>
          <Checkbox value="email" label="Email" />
          <Checkbox value="sms" label="SMS" />
        </CheckboxGroup>
      )
      const email = screen.getByRole('checkbox', { name: 'Email' })
      const sms = screen.getByRole('checkbox', { name: 'SMS' })
      expect(email).toBeChecked()
      expect(sms).not.toBeChecked()

      fireEvent.click(sms)
      expect(onChange).toHaveBeenCalledWith(['email', 'sms'])
      expect(sms).toBeChecked()
    })

    test('disabling a single checkbox only disables that option', () => {
      render(
        <CheckboxGroup aria-label="Notifications" defaultValue={[]}>
          <Checkbox value="email" label="Email" />
          <Checkbox value="sms" label="SMS" disabled />
        </CheckboxGroup>
      )
      expect(screen.getByRole('checkbox', { name: 'Email' })).toBeEnabled()
      expect(screen.getByRole('checkbox', { name: 'SMS' })).toBeDisabled()
    })

    test('disabling the group disables every checkbox', () => {
      render(
        <CheckboxGroup aria-label="Notifications" defaultValue={[]} disabled>
          <Checkbox value="email" label="Email" />
          <Checkbox value="sms" label="SMS" />
        </CheckboxGroup>
      )
      expect(screen.getByRole('checkbox', { name: 'Email' })).toBeDisabled()
      expect(screen.getByRole('checkbox', { name: 'SMS' })).toBeDisabled()
    })
  })

  describe('validation state', () => {
    test('sets aria-invalid on the input when invalid', () => {
      render(<Checkbox aria-label="Terms" invalid />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
    })

    test('does not set aria-invalid when not invalid', () => {
      render(<Checkbox aria-label="Terms" />)
      expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid')
    })

    test('sets aria-invalid on a CheckboxGroup item when invalid', () => {
      render(
        <CheckboxGroup aria-label="Notifications">
          <Checkbox value="email" label="Email" invalid />
        </CheckboxGroup>
      )
      expect(screen.getByRole('checkbox', { name: 'Email' })).toHaveAttribute(
        'aria-invalid',
        'true'
      )
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Checkbox ref={ref} aria-label="Terms" />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Checkbox label="Terms" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

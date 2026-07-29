import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCheckbox, CxCheckboxGroup } from '../../../index'

describe('CxCheckbox', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCheckbox />)
      expect(container).toMatchSnapshot()
    })
  })

  describe('styling props', () => {
    test('applies context and className to the wrapper and check input', () => {
      const { container } = render(
        <CxCheckbox className="bazinga" context="secondary" id="id" label="label" />
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
        <CxCheckbox
          button={{ context: 'primary', size: 'large', shape: 'rounded', variant: 'ghost' }}
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
  })

  describe('selection behavior', () => {
    test('an uncontrolled checkbox toggles on click and fires onChange(isSelected)', () => {
      const onChange = vi.fn()
      render(<CxCheckbox aria-label="Terms" defaultSelected={false} onChange={onChange} />)
      const input = screen.getByRole('checkbox')
      expect(input).not.toBeChecked()
      fireEvent.click(input)
      expect(input).toBeChecked()
      expect(onChange).toHaveBeenCalledWith(true)
    })

    test('a controlled checkbox reflects isSelected and fires onChange(isSelected) without changing itself', () => {
      const onChange = vi.fn()
      render(<CxCheckbox aria-label="Terms" isSelected={false} onChange={onChange} />)
      const input = screen.getByRole('checkbox')
      fireEvent.click(input)
      expect(onChange).toHaveBeenCalledWith(true)
      // Still false — the consumer owns the state and hasn't re-rendered with isSelected={true}.
      expect(input).not.toBeChecked()
    })

    test('indeterminate is synced onto the native input by the checkbox hook', () => {
      render(<CxCheckbox aria-label="Select all" indeterminate />)
      const input = screen.getByRole('checkbox') as HTMLInputElement
      expect(input.indeterminate).toBe(true)
    })

    test('inside a CxCheckboxGroup, selection is owned by the group and reported via its onChange', () => {
      const onChange = vi.fn()
      render(
        <CxCheckboxGroup aria-label="Notifications" defaultValue={['email']} onChange={onChange}>
          <CxCheckbox value="email" label="Email" />
          <CxCheckbox value="sms" label="SMS" />
        </CxCheckboxGroup>
      )
      const email = screen.getByRole('checkbox', { name: 'Email' })
      const sms = screen.getByRole('checkbox', { name: 'SMS' })
      expect(email).toBeChecked()
      expect(sms).not.toBeChecked()

      fireEvent.click(sms)
      expect(onChange).toHaveBeenCalledWith(['email', 'sms'])
      expect(sms).toBeChecked()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<CxCheckbox ref={ref} aria-label="Terms" />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCheckbox label="Terms" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CxTextInput } from '../../../index'

describe('CxTextInput', () => {
  describe('rendering', () => {
    test('renders a text input with the base class by default', () => {
      render(<CxTextInput aria-label="Name" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      expect(input).toHaveClass('form-input')
      expect(input).toHaveAttribute('type', 'text')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxTextInput />)
      expect(container).toMatchSnapshot()
    })

    test('applies plainText, size and invalid/valid classes together', () => {
      const { container } = render(
        <CxTextInput
          className="bazinga"
          invalid={true}
          plainText={true}
          size="large"
          type="color"
          valid={true}
        />
      )
      expect(container.firstChild).toHaveClass(
        'form-input',
        'plaintext',
        'large',
        'is-invalid',
        'is-valid',
        'bazinga'
      )
      expect(container.firstChild).not.toHaveClass('form-input-color')
      expect(container.firstChild).toHaveAttribute('type', 'color')
    })

    test('applies disabled and readOnly attributes', () => {
      render(<CxTextInput aria-label="Name" disabled readOnly value="fixed" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      expect(input).toBeDisabled()
      expect(input).toHaveAttribute('readonly')
    })
  })

  describe('change behavior', () => {
    test('fires onChange while typing (uncontrolled)', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<CxTextInput aria-label="Name" onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: 'Name' })
      await user.type(input, 'hi')
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(input).toHaveValue('hi')
    })

    test('reflects a controlled value and does not update without a matching value prop', () => {
      const onChange = vi.fn()
      render(<CxTextInput aria-label="Name" value="fixed" onChange={onChange} />)
      const input = screen.getByRole('textbox', { name: 'Name' })

      fireEvent.change(input, { target: { value: 'changed' } })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(input).toHaveValue('fixed')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<CxTextInput ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      const { container } = render(<CxTextInput aria-label="Name" />)
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<CxTextInput label="Name" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      expect(input.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Name').tagName).toBe('LABEL')
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<CxTextInput aria-label="Name" help="Some help" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(input.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby only when invalid', () => {
      const { rerender } = render(<CxTextInput aria-label="Name" invalidFeedback="Required" />)
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<CxTextInput aria-label="Name" invalid invalidFeedback="Required" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(input.getAttribute('aria-describedby')).toContain(feedback.id)
    })

    test('renders valid feedback only when valid is set', () => {
      render(<CxTextInput aria-label="Name" valid validFeedback="Looks good" />)
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxTextInput aria-label="Name" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('wires aria-invalid automatically from the invalid prop', async () => {
      const { container } = render(<CxTextInput aria-label="Name" invalid />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

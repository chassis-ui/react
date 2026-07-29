import * as React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
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
      const { container } = render(<CxTextInput aria-label="Name" />)
      expect(container).toMatchSnapshot()
    })

    test('applies plainText, size and invalid/valid classes together', () => {
      // type="color" has no textbox role, so the input isn't reachable by role query even with
      // an aria-label - container.firstChild access below is the only way to reach it.
      const { container } = render(
        <CxTextInput
          aria-label="Color"
          className="bazinga"
          invalid={true}
          plainText={true}
          size="large"
          type="color"
          valid={true}
        />
      )
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass(
        'form-input',
        'plaintext',
        'large',
        'is-invalid',
        'is-valid',
        'bazinga'
      )
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).not.toHaveClass('form-input-color')
      // eslint-disable-next-line testing-library/no-node-access
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
      // react-aria's internal validation-state effect updates state as a direct consequence of
      // `user.type`'s own dispatch, outside whatever act-environment userEvent itself toggles
      // (confirmed by capturing `IS_REACT_ACT_ENVIRONMENT` at warning time for the equivalent
      // CxDatePicker case) - needs an explicit `act(...)` around the interaction.
      // eslint-disable-next-line testing-library/no-unnecessary-act -- see comment above
      await act(async () => {
        await user.type(input, 'hi')
      })
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
      render(<CxTextInput aria-label="Name" ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<CxTextInput aria-label="Name" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<CxTextInput label="Name" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      // Same class-only wrapper as above - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
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

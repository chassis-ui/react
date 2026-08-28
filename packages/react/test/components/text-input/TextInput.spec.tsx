import * as React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { InputAdorn, TextInput } from '../../../src/index'

describe('TextInput', () => {
  describe('rendering', () => {
    test('renders a text input with the base class by default', () => {
      render(<TextInput aria-label="Name" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      expect(input).toHaveClass('form-input')
      expect(input).toHaveAttribute('type', 'text')
      expect(input).toHaveAttribute('tabindex', '0')
    })

    test('applies plainText, size and invalid/valid classes together', () => {
      // type="color" has no textbox role, so the input isn't reachable by role query even with
      // an aria-label - container.firstChild access below is the only way to reach it.
      const { container } = render(
        <TextInput
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
      render(<TextInput aria-label="Name" disabled readOnly value="fixed" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      expect(input).toBeDisabled()
      expect(input).toHaveAttribute('readonly')
    })
  })

  describe('adorns', () => {
    test('renders bare without a wrapper when adornStart/adornEnd are unset', () => {
      const { container } = render(<TextInput aria-label="Name" />)
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toBe(screen.getByRole('textbox', { name: 'Name' }))
    })

    test('wraps in .form-input with a .ghost-input when adornStart is set', () => {
      const { container } = render(
        <TextInput aria-label="Amount" adornStart={<InputAdorn>$</InputAdorn>} />
      )
      const input = screen.getByRole('textbox', { name: 'Amount' })
      expect(input).toHaveClass('ghost-input')
      expect(input).not.toHaveClass('form-input')
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('form-input')
      expect(screen.getByText('$')).toHaveClass('input-adorn')
    })

    test('renders adornStart before and adornEnd after the input', () => {
      render(
        <TextInput
          aria-label="Amount"
          adornStart={<InputAdorn>$</InputAdorn>}
          adornEnd={<InputAdorn>USD</InputAdorn>}
        />
      )
      const input = screen.getByRole('textbox', { name: 'Amount' })
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = input.parentElement as HTMLElement
      // eslint-disable-next-line testing-library/no-node-access
      expect(Array.from(wrapper.children).map((el) => el.textContent || el.tagName)).toEqual([
        '$',
        'INPUT',
        'USD'
      ])
      expect(screen.getByText('$')).toHaveClass('input-adorn')
      expect(screen.getByText('USD')).toHaveClass('input-adorn')
    })

    test('moves size, plainText and the caller className to the wrapper, not the ghost-input', () => {
      const { container } = render(
        <TextInput
          aria-label="Amount"
          adornStart={<InputAdorn>$</InputAdorn>}
          className="bazinga"
          plainText
          size="large"
        />
      )
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('form-input', 'plaintext', 'large', 'bazinga')
      const input = screen.getByRole('textbox', { name: 'Amount' })
      expect(input).not.toHaveClass('plaintext', 'large', 'bazinga')
    })

    test('keeps is-invalid/is-valid on the ghost-input, not the wrapper', () => {
      const { container } = render(
        <TextInput aria-label="Amount" adornStart={<InputAdorn>$</InputAdorn>} invalid valid />
      )
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).not.toHaveClass('is-invalid', 'is-valid')
      const input = screen.getByRole('textbox', { name: 'Amount' })
      expect(input).toHaveClass('is-invalid', 'is-valid')
    })

    test('renders an actionable button adorn with the input-adorn class directly on the button', async () => {
      const onClick = vi.fn()
      render(
        <TextInput
          aria-label="Password"
          type="password"
          adornEnd={
            <InputAdorn
              component="button"
              type="button"
              aria-label="Show password"
              onClick={onClick}
            >
              Show
            </InputAdorn>
          }
        />
      )
      const button = screen.getByRole('button', { name: 'Show password' })
      expect(button).toHaveClass('input-adorn')
      const user = userEvent.setup()
      await user.click(button)
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('change behavior', () => {
    test('fires onChange while typing (uncontrolled)', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<TextInput aria-label="Name" onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: 'Name' })
      // react-aria's internal validation-state effect updates state as a direct consequence of
      // `user.type`'s own dispatch, outside whatever act-environment userEvent itself toggles
      // (confirmed by capturing `IS_REACT_ACT_ENVIRONMENT` at warning time for the equivalent
      // DatePicker case) - needs an explicit `act(...)` around the interaction.
      // eslint-disable-next-line testing-library/no-unnecessary-act -- see comment above
      await act(async () => {
        await user.type(input, 'hi')
      })
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(input).toHaveValue('hi')
    })

    test('reflects a controlled value and does not update without a matching value prop', () => {
      const onChange = vi.fn()
      render(<TextInput aria-label="Name" value="fixed" onChange={onChange} />)
      const input = screen.getByRole('textbox', { name: 'Name' })

      fireEvent.change(input, { target: { value: 'changed' } })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(input).toHaveValue('fixed')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<TextInput aria-label="Name" ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<TextInput aria-label="Name" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<TextInput label="Name" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      // Same class-only wrapper as above - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Name').tagName).toBe('LABEL')
    })

    // FORMS.md gotcha #5: useTextField's own dev-mode check only sees the DOM node's own
    // aria-label/aria-labelledby, not the separately-rendered <FormLabel htmlFor>, so it must be
    // fed the merged labelledBy explicitly or it false-positives on every `label`-only render.
    test('does not trigger the react-aria missing-accessible-name warning when only label is set', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      render(<TextInput label="Name" />)
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<TextInput aria-label="Name" help="Some help" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(input.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby only when invalid', () => {
      const { rerender } = render(<TextInput aria-label="Name" invalidFeedback="Required" />)
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<TextInput aria-label="Name" invalid invalidFeedback="Required" />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(input.getAttribute('aria-describedby')).toContain(feedback.id)
    })

    test('renders valid feedback only when valid is set', () => {
      render(<TextInput aria-label="Name" valid validFeedback="Looks good" />)
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<TextInput aria-label="Name" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('wires aria-invalid automatically from the invalid prop', async () => {
      const { container } = render(<TextInput aria-label="Name" invalid />)
      const input = screen.getByRole('textbox', { name: 'Name' })
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations in a realistic composed state (label, help, invalidFeedback, adorns)', async () => {
      const { container } = render(
        <TextInput
          label="Amount"
          help="Enter the amount in USD"
          invalid
          invalidFeedback="Required"
          adornStart={<InputAdorn>$</InputAdorn>}
          adornEnd={<InputAdorn>USD</InputAdorn>}
        />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

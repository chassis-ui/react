import * as React from 'react'
import { act, render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { OtpInput } from '../../../src/index'

describe('OtpInput', () => {
  describe('rendering', () => {
    test('renders one labeled box per digit', () => {
      render(<OtpInput aria-label="Verification code" length={4} />)
      expect(screen.getByRole('group', { name: 'Verification code' })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: 'Digit 1' })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: 'Digit 4' })).toBeInTheDocument()
      expect(screen.queryByRole('textbox', { name: 'Digit 5' })).not.toBeInTheDocument()
    })

    test('groupSizes renders a separator between groups', () => {
      // The separator is a decorative element with no role/name - no accessible query for it.
      const { container } = render(<OtpInput aria-label="Code" groupSizes={[3, 3]} />)
      expect(screen.getAllByRole('textbox')).toHaveLength(6)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-otp-separator')).toBeInTheDocument()
    })

    test('disabled boxes cannot be edited', () => {
      render(<OtpInput aria-label="Code" disabled length={3} />)
      expect(screen.getByRole('textbox', { name: 'Digit 1' })).toBeDisabled()
    })
  })

  describe('inputGroup', () => {
    test('without groupSizes, applies input-group to the root instead of wrapping boxes', () => {
      render(<OtpInput aria-label="Code" inputGroup length={3} />)
      const group = screen.getByRole('group', { name: 'Code' })
      expect(group).toHaveClass('form-otp', 'input-group')
      // eslint-disable-next-line testing-library/no-node-access
      expect(group.querySelector('.input-group')).toBeNull()
    })

    test('with groupSizes, wraps each group in its own input-group instead of the root', () => {
      render(<OtpInput aria-label="Code" groupSizes={[3, 3]} inputGroup />)
      const group = screen.getByRole('group', { name: 'Code' })
      expect(group).not.toHaveClass('input-group')
      // eslint-disable-next-line testing-library/no-node-access
      const wrappers = group.querySelectorAll(':scope > .input-group')
      expect(wrappers).toHaveLength(2)
      expect(within(wrappers[0] as HTMLElement).getAllByRole('textbox')).toHaveLength(3)
      expect(within(wrappers[1] as HTMLElement).getAllByRole('textbox')).toHaveLength(3)
    })

    test('groupSizes without inputGroup renders no input-group wrapper at all', () => {
      render(<OtpInput aria-label="Code" groupSizes={[3, 3]} />)
      const group = screen.getByRole('group', { name: 'Code' })
      expect(group).not.toHaveClass('input-group')
      // eslint-disable-next-line testing-library/no-node-access
      expect(group.querySelector('.input-group')).toBeNull()
    })
  })

  describe('digit entry', () => {
    test('typing a digit advances focus to the next box', () => {
      render(<OtpInput aria-label="Verification code" length={4} />)
      const first = screen.getByRole('textbox', { name: 'Digit 1' })
      fireEvent.change(first, { target: { value: '1' } })
      expect(screen.getByRole('textbox', { name: 'Digit 2' })).toHaveFocus()
    })

    test('calls onChange with the combined value and onComplete once every box is filled', () => {
      const onChange = vi.fn()
      const onComplete = vi.fn()
      render(<OtpInput aria-label="Code" length={3} onChange={onChange} onComplete={onComplete} />)
      fireEvent.change(screen.getByRole('textbox', { name: 'Digit 1' }), {
        target: { value: '1' }
      })
      fireEvent.change(screen.getByRole('textbox', { name: 'Digit 2' }), {
        target: { value: '2' }
      })
      expect(onComplete).not.toHaveBeenCalled()
      fireEvent.change(screen.getByRole('textbox', { name: 'Digit 3' }), {
        target: { value: '3' }
      })
      expect(onChange).toHaveBeenLastCalledWith('123')
      expect(onComplete).toHaveBeenCalledWith('123')
    })

    test('a non-digit character is not entered, and reports no change', () => {
      const onChange = vi.fn()
      render(<OtpInput aria-label="Code" length={3} onChange={onChange} />)
      fireEvent.change(screen.getByRole('textbox', { name: 'Digit 1' }), { target: { value: 'a' } })
      expect(screen.getByRole('textbox', { name: 'Digit 1' })).toHaveValue('')
      expect(onChange).not.toHaveBeenCalled()
    })

    test('a multi-character value (autofill) distributes across subsequent boxes', () => {
      const onChange = vi.fn()
      render(<OtpInput aria-label="Code" length={4} onChange={onChange} />)
      fireEvent.change(screen.getByRole('textbox', { name: 'Digit 1' }), {
        target: { value: '1234' }
      })
      expect(onChange).toHaveBeenLastCalledWith('1234')
      expect(screen.getByRole('textbox', { name: 'Digit 4' })).toHaveFocus()
    })

    test('pasting a full code distributes digits and focuses the last filled box', () => {
      const onChange = vi.fn()
      render(<OtpInput aria-label="Code" length={4} onChange={onChange} />)
      fireEvent.paste(screen.getByRole('textbox', { name: 'Digit 1' }), {
        clipboardData: { getData: () => '12-34' }
      })
      expect(onChange).toHaveBeenCalledWith('1234')
      expect(screen.getByRole('textbox', { name: 'Digit 4' })).toHaveFocus()
    })

    // Focus went to the last filled box, which selects its content on focus: the next digit
    // typed replaced the third one instead of filling the fourth box.
    test('pasting a partial code focuses the next empty box, so typing goes on from there', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<OtpInput aria-label="Code" length={6} onChange={onChange} />)
      fireEvent.paste(screen.getByRole('textbox', { name: 'Digit 1' }), {
        clipboardData: { getData: () => '123' }
      })
      expect(onChange).toHaveBeenLastCalledWith('123')
      expect(screen.getByRole('textbox', { name: 'Digit 4' })).toHaveFocus()

      await user.keyboard('4')
      expect(onChange).toHaveBeenLastCalledWith('1234')
      expect(screen.getByRole('textbox', { name: 'Digit 3' })).toHaveValue('3')
      expect(screen.getByRole('textbox', { name: 'Digit 5' })).toHaveFocus()
    })

    test('pasting content with no digits is a no-op', () => {
      const onChange = vi.fn()
      render(<OtpInput aria-label="Code" length={3} onChange={onChange} />)
      fireEvent.paste(screen.getByRole('textbox', { name: 'Digit 1' }), {
        clipboardData: { getData: () => 'abc' }
      })
      expect(onChange).not.toHaveBeenCalled()
    })

    test('paste is a no-op when disabled', () => {
      const onChange = vi.fn()
      render(<OtpInput aria-label="Code" disabled length={3} onChange={onChange} />)
      fireEvent.paste(screen.getByRole('textbox', { name: 'Digit 1' }), {
        clipboardData: { getData: () => '123' }
      })
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('editing and keyboard navigation', () => {
    test('Backspace on an empty box clears and focuses the previous box', () => {
      const onChange = vi.fn()
      render(<OtpInput aria-label="Code" defaultValue="12" length={3} onChange={onChange} />)
      const third = screen.getByRole('textbox', { name: 'Digit 3' })
      fireEvent.keyDown(third, { key: 'Backspace' })
      const second = screen.getByRole('textbox', { name: 'Digit 2' })
      expect(second).toHaveFocus()
      expect(onChange).toHaveBeenCalledWith('1')
    })

    test('Delete shifts remaining values left', () => {
      const onChange = vi.fn()
      render(<OtpInput aria-label="Code" defaultValue="123" length={3} onChange={onChange} />)
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Digit 1' }), { key: 'Delete' })
      expect(onChange).toHaveBeenCalledWith('23')
    })

    test('Delete on the last box only clears that box, with no out-of-bounds shift', () => {
      const onChange = vi.fn()
      render(<OtpInput aria-label="Code" defaultValue="123" length={3} onChange={onChange} />)
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Digit 3' }), { key: 'Delete' })
      expect(onChange).toHaveBeenCalledWith('12')
    })

    test('Backspace on the first box is a no-op (no previous box to clear)', () => {
      const onChange = vi.fn()
      render(<OtpInput aria-label="Code" length={3} onChange={onChange} />)
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Digit 1' }), { key: 'Backspace' })
      expect(onChange).not.toHaveBeenCalled()
    })

    test('arrow keys move focus between boxes', () => {
      render(<OtpInput aria-label="Code" defaultValue="123" length={3} />)
      const first = screen.getByRole('textbox', { name: 'Digit 1' })
      fireEvent.keyDown(first, { key: 'ArrowRight' })
      expect(screen.getByRole('textbox', { name: 'Digit 2' })).toHaveFocus()
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Digit 2' }), { key: 'ArrowLeft' })
      expect(first).toHaveFocus()
    })

    test('arrow keys mirror under dir="rtl"', () => {
      render(
        <div dir="rtl">
          <OtpInput aria-label="Code" defaultValue="123" length={3} />
        </div>
      )
      const first = screen.getByRole('textbox', { name: 'Digit 1' })
      // In an RTL field the second box sits to the *left* of the first, so ArrowLeft is what moves
      // forward through the code — the mapping is by visual direction, not by key name.
      fireEvent.keyDown(first, { key: 'ArrowLeft' })
      expect(screen.getByRole('textbox', { name: 'Digit 2' })).toHaveFocus()
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Digit 2' }), { key: 'ArrowRight' })
      expect(first).toHaveFocus()
    })

    // The code is entered from the start: a digit typed in the third box of `1 _ _ _` would leave
    // a gap.
    test('a box past the first empty one sends focus to that box', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<OtpInput aria-label="Code" defaultValue="1" length={4} onChange={onChange} />)
      await user.click(screen.getByRole('textbox', { name: 'Digit 3' }))
      expect(screen.getByRole('textbox', { name: 'Digit 2' })).toHaveFocus()

      await user.keyboard('2')
      expect(onChange).toHaveBeenLastCalledWith('12')
      expect(screen.getByRole('textbox', { name: 'Digit 3' })).toHaveFocus()
    })

    const values = () =>
      screen.getAllByRole('textbox').map((box) => (box as HTMLInputElement).value)

    // The code was rebuilt from one string with no gaps, so every later digit moved one box left.
    test('Backspace on a filled box clears it in place', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<OtpInput aria-label="Code" defaultValue="123456" length={6} onChange={onChange} />)
      await user.click(screen.getByRole('textbox', { name: 'Digit 3' }))
      await user.keyboard('{Backspace}')
      expect(values()).toEqual(['1', '2', '', '4', '5', '6'])
      expect(onChange).toHaveBeenLastCalledWith('12456')
      expect(screen.getByRole('textbox', { name: 'Digit 3' })).toHaveFocus()

      // The digits after the gap can still be reached and corrected, and the gap filled.
      await user.click(screen.getByRole('textbox', { name: 'Digit 5' }))
      expect(screen.getByRole('textbox', { name: 'Digit 5' })).toHaveFocus()
      await user.keyboard('9')
      expect(values()).toEqual(['1', '2', '', '4', '9', '6'])
      await user.click(screen.getByRole('textbox', { name: 'Digit 3' }))
      await user.keyboard('3')
      expect(values()).toEqual(['1', '2', '3', '4', '9', '6'])
      expect(onChange).toHaveBeenLastCalledWith('123496')
    })

    test('a key other than a digit leaves a filled box as it was', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<OtpInput aria-label="Code" defaultValue="1234" length={4} onChange={onChange} />)
      await user.click(screen.getByRole('textbox', { name: 'Digit 2' }))
      await user.keyboard('a')
      expect(values()).toEqual(['1', '2', '3', '4'])
      expect(onChange).not.toHaveBeenCalled()
    })

    test('a controlled code keeps a box cleared in place', async () => {
      const user = userEvent.setup()
      const Controlled = () => {
        const [code, setCode] = React.useState('1234')
        return <OtpInput aria-label="Code" length={4} onChange={setCode} value={code} />
      }
      render(<Controlled />)
      await user.click(screen.getByRole('textbox', { name: 'Digit 2' }))
      await user.keyboard('{Backspace}')
      expect(values()).toEqual(['1', '', '3', '4'])
    })

    test('typing on through the boxes is not sent back', async () => {
      const user = userEvent.setup()
      render(<OtpInput aria-label="Code" length={4} />)
      await user.click(screen.getByRole('textbox', { name: 'Digit 1' }))
      await user.keyboard('123')
      expect(screen.getByRole('textbox', { name: 'Digit 4' })).toHaveFocus()
    })
  })

  describe('form integration', () => {
    // Each box reset itself against the same code: "1234" became "123", with four `onChange`.
    test('a form reset puts the code back once', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <form aria-label="Verify">
          <OtpInput aria-label="Code" defaultValue="9" length={4} onChange={onChange} />
          <button type="reset">Reset</button>
        </form>
      )
      await user.click(screen.getByRole('textbox', { name: 'Digit 2' }))
      await user.keyboard('234')
      onChange.mockClear()

      await user.click(screen.getByRole('button', { name: 'Reset' }))
      expect(onChange.mock.calls).toEqual([['9']])
      expect(screen.getAllByRole('textbox').map((box) => (box as HTMLInputElement).value)).toEqual([
        '9',
        '',
        '',
        ''
      ])
    })

    test('creates a hidden input for form submission when name is provided', () => {
      // Hidden inputs are intentionally excluded from the accessibility tree - no query reaches
      // them.
      const { container } = render(
        <OtpInput aria-label="Code" defaultValue="123" length={3} name="code" />
      )
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const hidden = container.querySelector(
        'input[type="hidden"][name="code"]'
      ) as HTMLInputElement
      expect(hidden.value).toBe('123')
    })

    test('supports controlled value', () => {
      const { rerender } = render(<OtpInput aria-label="Code" length={3} value="1" />)
      expect(screen.getByRole('textbox', { name: 'Digit 1' })).toHaveValue('1')
      rerender(<OtpInput aria-label="Code" length={3} value="12" />)
      expect(screen.getByRole('textbox', { name: 'Digit 2' })).toHaveValue('2')
    })
  })

  // The code had no `required` at all: nothing marked its boxes for a screen reader or held a
  // form back, and the input that carries `name` is `type="hidden"`, which a form doesn't
  // validate.
  describe('required', () => {
    const Verify = ({
      onSubmit = () => undefined,
      ...props
    }: React.ComponentProps<typeof OtpInput> & { onSubmit?: () => void }) => (
      <form
        aria-label="Verify"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <OtpInput label="Code" length={4} name="code" {...props} />
        <button type="submit">Save</button>
      </form>
    )
    const form = () => screen.getByRole<HTMLFormElement>('form', { name: 'Verify' })
    const box = (digit: number) => screen.getByRole('textbox', { name: `Digit ${digit}` })
    const save = () => screen.getByRole('button', { name: 'Save' })
    // react-aria listens for `invalid` on each box and updates its validation state.
    const checkValidity = () => {
      let valid = true
      act(() => {
        valid = form().checkValidity()
      })
      return valid
    }
    // What each case below is told apart from: an empty required code, which holds its form
    // back. Rendered first, then the case in its place.
    const insteadOfEmpty = (ui: React.ReactElement) => {
      const { unmount } = render(<Verify required />)
      expect(checkValidity()).toBe(false)
      unmount()
      return render(ui)
    }

    test('an empty required code holds its form back, and its first box takes focus', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<Verify onSubmit={onSubmit} required />)

      expect(checkValidity()).toBe(false)
      await user.click(save())
      expect(onSubmit).not.toHaveBeenCalled()
      expect(box(1)).toHaveFocus()
    })

    // The native attribute says it, on each box: no `aria-required` beside it.
    test('every box is required natively', () => {
      const { rerender } = render(<Verify required />)
      for (const input of screen.getAllByRole('textbox')) {
        expect(input).toBeRequired()
        expect(input).toHaveAttribute('required')
        expect(input).not.toHaveAttribute('aria-required')
      }
      rerender(<Verify />)
      for (const input of screen.getAllByRole('textbox')) {
        expect(input).not.toBeRequired()
      }
    })

    test('a code with a box left empty still holds it back, and that box takes focus', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<Verify onSubmit={onSubmit} required />)
      await user.click(box(1))
      await user.keyboard('12')
      expect(form()).toHaveFormValues({ code: '12' })

      await user.click(save())
      expect(onSubmit).not.toHaveBeenCalled()
      expect(box(3)).toHaveFocus()
    })

    test('submits once every box is filled', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<Verify onSubmit={onSubmit} required />)
      expect(checkValidity()).toBe(false)
      await user.click(box(1))
      await user.keyboard('1234')

      expect(checkValidity()).toBe(true)
      await user.click(save())
      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(form()).toHaveFormValues({ code: '1234' })
    })

    test('submits a code it was given', () => {
      insteadOfEmpty(<Verify defaultValue="1234" required />)
      expect(checkValidity()).toBe(true)
    })

    test.each([
      ['disabled', { disabled: true, required: true }],
      ['not required', {}]
    ])('a %s one holds nothing back', (_state, props) => {
      insteadOfEmpty(<Verify {...props} />)
      expect(checkValidity()).toBe(true)
    })

    // Validation rests on the boxes, not on the input that carries `name`.
    test('holds the form back with no name', () => {
      render(<Verify name={undefined} required />)
      expect(checkValidity()).toBe(false)
    })

    test('holds the form back in groups, masked', () => {
      const { rerender } = render(<Verify groupSizes={[2, 2]} mask required />)
      expect(checkValidity()).toBe(false)
      rerender(<Verify groupSizes={[2, 2]} mask required value="1234" />)
      expect(checkValidity()).toBe(true)
    })

    test('has no axe violations while required and invalid, and logs no error', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      const { container } = render(<Verify invalid invalidFeedback="Enter the code." required />)
      expect(box(1)).toBeRequired()
      expect(box(1)).toBeInvalid()
      expect(screen.getByRole('group', { name: 'Code' })).toHaveAccessibleDescription(
        'Enter the code.'
      )
      expect(await axe(container)).toHaveNoViolations()
      expect(consoleError).not.toHaveBeenCalled()
      consoleError.mockRestore()
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<OtpInput aria-label="Code" length={3} />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via aria-labelledby when label is set', () => {
      render(<OtpInput label="Verification code" length={3} />)
      const group = screen.getByRole('group', { name: 'Verification code' })
      // Same class-only wrapper as above - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(group.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Verification code').tagName).toBe('LABEL')
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<OtpInput aria-label="Code" help="Some help" length={3} />)
      const group = screen.getByRole('group', { name: 'Code' })
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(group.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby only when invalid', () => {
      const { rerender } = render(
        <OtpInput aria-label="Code" invalidFeedback="Required" length={3} />
      )
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<OtpInput aria-label="Code" invalid invalidFeedback="Required" length={3} />)
      const group = screen.getByRole('group', { name: 'Code' })
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(group.getAttribute('aria-describedby')).toContain(feedback.id)
    })

    test('renders valid feedback only when valid is set', () => {
      render(<OtpInput aria-label="Code" length={3} valid validFeedback="Looks good" />)
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })

    test('forwards the invalid/valid class onto each digit box, not just the wrapper', () => {
      const { rerender } = render(<OtpInput aria-label="Code" invalid length={3} />)
      screen
        .getAllByRole('textbox')
        .forEach((box) => expect(box).toHaveClass('form-input', 'is-invalid'))

      rerender(<OtpInput aria-label="Code" length={3} valid />)
      screen
        .getAllByRole('textbox')
        .forEach((box) => expect(box).toHaveClass('form-input', 'is-valid'))
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<OtpInput aria-label="Verification code" length={4} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

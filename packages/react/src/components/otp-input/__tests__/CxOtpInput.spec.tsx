import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxOtpInput } from '../../../index'

describe('CxOtpInput', () => {
  describe('rendering', () => {
    test('renders one labeled box per digit', () => {
      render(<CxOtpInput aria-label="Verification code" length={4} />)
      expect(screen.getByRole('group', { name: 'Verification code' })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: 'Digit 1' })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: 'Digit 4' })).toBeInTheDocument()
      expect(screen.queryByRole('textbox', { name: 'Digit 5' })).not.toBeInTheDocument()
    })

    test('groupSizes renders a separator between groups', () => {
      // The separator is a decorative element with no role/name - no accessible query for it.
      const { container } = render(<CxOtpInput aria-label="Code" groupSizes={[3, 3]} />)
      expect(screen.getAllByRole('textbox')).toHaveLength(6)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-otp-separator')).toBeInTheDocument()
    })

    test('disabled boxes cannot be edited', () => {
      render(<CxOtpInput aria-label="Code" disabled length={3} />)
      expect(screen.getByRole('textbox', { name: 'Digit 1' })).toBeDisabled()
    })
  })

  describe('digit entry', () => {
    test('typing a digit advances focus to the next box', () => {
      render(<CxOtpInput aria-label="Verification code" length={4} />)
      const first = screen.getByRole('textbox', { name: 'Digit 1' })
      fireEvent.change(first, { target: { value: '1' } })
      expect(screen.getByRole('textbox', { name: 'Digit 2' })).toHaveFocus()
    })

    test('calls onChange with the combined value and onComplete once every box is filled', () => {
      const onChange = vi.fn()
      const onComplete = vi.fn()
      render(
        <CxOtpInput aria-label="Code" length={3} onChange={onChange} onComplete={onComplete} />
      )
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

    test('non-digit characters are stripped', () => {
      const onChange = vi.fn()
      render(<CxOtpInput aria-label="Code" length={3} onChange={onChange} />)
      fireEvent.change(screen.getByRole('textbox', { name: 'Digit 1' }), { target: { value: 'a' } })
      expect(screen.getByRole('textbox', { name: 'Digit 1' })).toHaveValue('')
      expect(onChange).toHaveBeenCalledWith('')
    })

    test('a multi-character value (autofill) distributes across subsequent boxes', () => {
      const onChange = vi.fn()
      render(<CxOtpInput aria-label="Code" length={4} onChange={onChange} />)
      fireEvent.change(screen.getByRole('textbox', { name: 'Digit 1' }), {
        target: { value: '1234' }
      })
      expect(onChange).toHaveBeenLastCalledWith('1234')
      expect(screen.getByRole('textbox', { name: 'Digit 4' })).toHaveFocus()
    })

    test('pasting a full code distributes digits and focuses the last filled box', () => {
      const onChange = vi.fn()
      render(<CxOtpInput aria-label="Code" length={4} onChange={onChange} />)
      fireEvent.paste(screen.getByRole('textbox', { name: 'Digit 1' }), {
        clipboardData: { getData: () => '12-34' }
      })
      expect(onChange).toHaveBeenCalledWith('1234')
      expect(screen.getByRole('textbox', { name: 'Digit 4' })).toHaveFocus()
    })
  })

  describe('editing and keyboard navigation', () => {
    test('Backspace on an empty box clears and focuses the previous box', () => {
      const onChange = vi.fn()
      render(<CxOtpInput aria-label="Code" defaultValue="12" length={3} onChange={onChange} />)
      const third = screen.getByRole('textbox', { name: 'Digit 3' })
      fireEvent.keyDown(third, { key: 'Backspace' })
      const second = screen.getByRole('textbox', { name: 'Digit 2' })
      expect(second).toHaveFocus()
      expect(onChange).toHaveBeenCalledWith('1')
    })

    test('Delete shifts remaining values left', () => {
      const onChange = vi.fn()
      render(<CxOtpInput aria-label="Code" defaultValue="123" length={3} onChange={onChange} />)
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Digit 1' }), { key: 'Delete' })
      expect(onChange).toHaveBeenCalledWith('23')
    })

    test('arrow keys move focus between boxes', () => {
      render(<CxOtpInput aria-label="Code" length={3} />)
      const first = screen.getByRole('textbox', { name: 'Digit 1' })
      fireEvent.keyDown(first, { key: 'ArrowRight' })
      expect(screen.getByRole('textbox', { name: 'Digit 2' })).toHaveFocus()
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Digit 2' }), { key: 'ArrowLeft' })
      expect(first).toHaveFocus()
    })
  })

  describe('form integration', () => {
    test('creates a hidden input for form submission when name is provided', () => {
      // Hidden inputs are intentionally excluded from the accessibility tree - no query reaches
      // them.
      const { container } = render(
        <CxOtpInput aria-label="Code" defaultValue="123" length={3} name="code" />
      )
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const hidden = container.querySelector(
        'input[type="hidden"][name="code"]'
      ) as HTMLInputElement
      expect(hidden.value).toBe('123')
    })

    test('supports controlled value', () => {
      const { rerender } = render(<CxOtpInput aria-label="Code" length={3} value="1" />)
      expect(screen.getByRole('textbox', { name: 'Digit 1' })).toHaveValue('1')
      rerender(<CxOtpInput aria-label="Code" length={3} value="12" />)
      expect(screen.getByRole('textbox', { name: 'Digit 2' })).toHaveValue('2')
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<CxOtpInput aria-label="Code" length={3} />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via aria-labelledby when label is set', () => {
      render(<CxOtpInput label="Verification code" length={3} />)
      const group = screen.getByRole('group', { name: 'Verification code' })
      // Same class-only wrapper as above - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(group.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Verification code').tagName).toBe('LABEL')
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<CxOtpInput aria-label="Code" help="Some help" length={3} />)
      const group = screen.getByRole('group', { name: 'Code' })
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(group.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby only when invalid', () => {
      const { rerender } = render(
        <CxOtpInput aria-label="Code" invalidFeedback="Required" length={3} />
      )
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<CxOtpInput aria-label="Code" invalid invalidFeedback="Required" length={3} />)
      const group = screen.getByRole('group', { name: 'Code' })
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(group.getAttribute('aria-describedby')).toContain(feedback.id)
    })

    test('renders valid feedback only when valid is set', () => {
      render(<CxOtpInput aria-label="Code" length={3} valid validFeedback="Looks good" />)
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxOtpInput aria-label="Verification code" length={4} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

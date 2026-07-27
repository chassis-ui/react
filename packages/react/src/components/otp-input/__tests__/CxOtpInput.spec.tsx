import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import { CxOtpInput } from '../../../index'

test('renders one labeled box per digit', () => {
  render(<CxOtpInput aria-label="Verification code" length={4} />)
  expect(screen.getByRole('group', { name: 'Verification code' })).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: 'Digit 1' })).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: 'Digit 4' })).toBeInTheDocument()
  expect(screen.queryByRole('textbox', { name: 'Digit 5' })).not.toBeInTheDocument()
})

test('typing a digit advances focus to the next box', () => {
  render(<CxOtpInput aria-label="Verification code" length={4} />)
  const first = screen.getByRole('textbox', { name: 'Digit 1' })
  fireEvent.change(first, { target: { value: '1' } })
  expect(screen.getByRole('textbox', { name: 'Digit 2' })).toHaveFocus()
})

test('calls onChange with the combined value and onComplete once every box is filled', () => {
  const onChange = jest.fn()
  const onComplete = jest.fn()
  render(<CxOtpInput aria-label="Code" length={3} onChange={onChange} onComplete={onComplete} />)
  fireEvent.change(screen.getByRole('textbox', { name: 'Digit 1' }), { target: { value: '1' } })
  fireEvent.change(screen.getByRole('textbox', { name: 'Digit 2' }), { target: { value: '2' } })
  expect(onComplete).not.toHaveBeenCalled()
  fireEvent.change(screen.getByRole('textbox', { name: 'Digit 3' }), { target: { value: '3' } })
  expect(onChange).toHaveBeenLastCalledWith('123')
  expect(onComplete).toHaveBeenCalledWith('123')
})

test('non-digit characters are stripped', () => {
  const onChange = jest.fn()
  render(<CxOtpInput aria-label="Code" length={3} onChange={onChange} />)
  fireEvent.change(screen.getByRole('textbox', { name: 'Digit 1' }), { target: { value: 'a' } })
  expect(screen.getByRole('textbox', { name: 'Digit 1' })).toHaveValue('')
  expect(onChange).toHaveBeenCalledWith('')
})

test('a multi-character value (autofill) distributes across subsequent boxes', () => {
  const onChange = jest.fn()
  render(<CxOtpInput aria-label="Code" length={4} onChange={onChange} />)
  fireEvent.change(screen.getByRole('textbox', { name: 'Digit 1' }), { target: { value: '1234' } })
  expect(onChange).toHaveBeenLastCalledWith('1234')
  expect(screen.getByRole('textbox', { name: 'Digit 4' })).toHaveFocus()
})

test('Backspace on an empty box clears and focuses the previous box', () => {
  const onChange = jest.fn()
  render(<CxOtpInput aria-label="Code" defaultValue="12" length={3} onChange={onChange} />)
  const third = screen.getByRole('textbox', { name: 'Digit 3' })
  fireEvent.keyDown(third, { key: 'Backspace' })
  const second = screen.getByRole('textbox', { name: 'Digit 2' })
  expect(second).toHaveFocus()
  expect(onChange).toHaveBeenCalledWith('1')
})

test('Delete shifts remaining values left', () => {
  const onChange = jest.fn()
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

test('pasting a full code distributes digits and focuses the last filled box', () => {
  const onChange = jest.fn()
  render(<CxOtpInput aria-label="Code" length={4} onChange={onChange} />)
  fireEvent.paste(screen.getByRole('textbox', { name: 'Digit 1' }), {
    clipboardData: { getData: () => '12-34' }
  })
  expect(onChange).toHaveBeenCalledWith('1234')
  expect(screen.getByRole('textbox', { name: 'Digit 4' })).toHaveFocus()
})

test('creates a hidden input for form submission when name is provided', () => {
  const { container } = render(
    <CxOtpInput aria-label="Code" defaultValue="123" length={3} name="code" />
  )
  const hidden = container.querySelector('input[type="hidden"][name="code"]') as HTMLInputElement
  expect(hidden.value).toBe('123')
})

test('supports controlled value', () => {
  const { rerender } = render(<CxOtpInput aria-label="Code" length={3} value="1" />)
  expect(screen.getByRole('textbox', { name: 'Digit 1' })).toHaveValue('1')
  rerender(<CxOtpInput aria-label="Code" length={3} value="12" />)
  expect(screen.getByRole('textbox', { name: 'Digit 2' })).toHaveValue('2')
})

test('disabled boxes cannot be edited', () => {
  render(<CxOtpInput aria-label="Code" disabled length={3} />)
  expect(screen.getByRole('textbox', { name: 'Digit 1' })).toBeDisabled()
})

test('groupSizes renders a separator between groups', () => {
  const { container } = render(<CxOtpInput aria-label="Code" groupSizes={[3, 3]} />)
  expect(container.querySelectorAll('.form-input')).toHaveLength(6)
  expect(container.querySelector('.form-otp-separator')).toBeInTheDocument()
})

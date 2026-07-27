import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { CxFormSwitch } from '../../../index'

test('loads and displays CxFormSwitch component', async () => {
  const { container } = render(<CxFormSwitch />)
  expect(container).toMatchSnapshot()
})

test('CxFormSwitch customize', async () => {
  const { container } = render(
    <CxFormSwitch
      className="bazinga"
      context="secondary"
      id="2"
      invalid={true}
      label="Some label"
      size="large"
      type="radio"
      valid={true}
    />
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('form-check')
  expect(container.firstChild).toHaveClass('form-switch')
  expect(container.firstChild).toHaveClass('large')
  expect(container.firstChild).toHaveClass('is-invalid')
  expect(container.firstChild).toHaveClass('is-valid')
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveTextContent('Some label')
  if (container.firstChild === null) {
    expect(true).toBe(false)
  } else {
    const checkInput = container.firstChild.firstChild
    expect(checkInput).toHaveClass('check-input')
    expect(checkInput).toHaveClass('secondary')
    expect(checkInput).toHaveClass('is-invalid')
    expect(checkInput).toHaveClass('is-valid')

    const input = checkInput?.firstChild
    expect(input).toHaveClass('is-invalid')
    expect(input).toHaveClass('is-valid')
    expect(input).toHaveAttribute('id', '2')
    expect(input).toHaveAttribute('type', 'radio')
    expect(input).toHaveAttribute('role', 'switch')
  }
})

test('renders role="switch" for the checkbox-backed default type', () => {
  render(<CxFormSwitch aria-label="Notifications" />)
  expect(screen.getByRole('switch')).toBeInTheDocument()
})

test('an uncontrolled switch toggles on click and fires onChange(isSelected)', () => {
  const onChange = vi.fn()
  render(<CxFormSwitch aria-label="Notifications" defaultSelected={false} onChange={onChange} />)
  const input = screen.getByRole('switch')
  expect(input).not.toBeChecked()
  fireEvent.click(input)
  expect(input).toBeChecked()
  expect(onChange).toHaveBeenCalledWith(true)
})

test('a controlled switch reflects isSelected and fires onChange(isSelected) without changing itself', () => {
  const onChange = vi.fn()
  render(<CxFormSwitch aria-label="Notifications" isSelected={false} onChange={onChange} />)
  const input = screen.getByRole('switch')
  fireEvent.click(input)
  expect(onChange).toHaveBeenCalledWith(true)
  expect(input).not.toBeChecked()
})

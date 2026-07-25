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
      id="2"
      invalid={true}
      label="Some label"
      size="xlarge"
      type="radio"
      valid={true}
    />,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('form-check')
  expect(container.firstChild).toHaveClass('form-switch')
  expect(container.firstChild).toHaveClass('form-switch-xlarge')
  expect(container.firstChild).toHaveClass('is-invalid')
  expect(container.firstChild).toHaveClass('is-valid')
  expect(container.firstChild).toHaveClass('bazinga')
  if (container.firstChild === null) {
    expect(true).toBe(false)
  } else {
    expect(container.firstChild.firstChild).toHaveClass('form-check-input')
    expect(container.firstChild.firstChild).toHaveClass('is-invalid')
    expect(container.firstChild.firstChild).toHaveClass('is-valid')
    expect(container.firstChild.firstChild).toHaveAttribute('id', '2')
    expect(container.firstChild.firstChild).toHaveAttribute('type', 'radio')
    expect(container.firstChild.lastChild).toHaveClass('form-check-label')
    expect(container.firstChild.lastChild).toHaveTextContent('Some label')
    expect(container.firstChild.lastChild).toHaveAttribute('for', '2')
  }
})

test('renders role="switch" for the checkbox-backed default type', () => {
  render(<CxFormSwitch aria-label="Notifications" />)
  expect(screen.getByRole('switch')).toBeInTheDocument()
})

test('an uncontrolled switch toggles on click and fires onChange(isSelected)', () => {
  const onChange = jest.fn()
  render(<CxFormSwitch aria-label="Notifications" defaultSelected={false} onChange={onChange} />)
  const input = screen.getByRole('switch')
  expect(input).not.toBeChecked()
  fireEvent.click(input)
  expect(input).toBeChecked()
  expect(onChange).toHaveBeenCalledWith(true)
})

test('a controlled switch reflects isSelected and fires onChange(isSelected) without changing itself', () => {
  const onChange = jest.fn()
  render(<CxFormSwitch aria-label="Notifications" isSelected={false} onChange={onChange} />)
  const input = screen.getByRole('switch')
  fireEvent.click(input)
  expect(onChange).toHaveBeenCalledWith(true)
  expect(input).not.toBeChecked()
})

import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { CxFormCheck } from '../../../index'

test('loads and displays CxFormCheck component', async () => {
  const { container } = render(<CxFormCheck />)
  expect(container).toMatchSnapshot()
})

test('CxFormCheck customize button=false', async () => {
  const { container } = render(
    <CxFormCheck className="bazinga" context="secondary" id="id" label="label" type="radio" />,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('form-check')
  const checkInput = screen.getByRole('radio').parentElement
  expect(checkInput).toHaveClass('check-input')
  expect(checkInput).toHaveClass('secondary')
})

test('CxFormCheck customize button=true', async () => {
  const { container } = render(
    <CxFormCheck
      button={{ context: 'primary', size: 'large', shape: 'rounded', variant: 'ghost' }}
      className="bazinga"
      id="id"
      label="label"
      type="radio"
    />,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('button')
  expect(container.firstChild).toHaveClass('button-check')
  expect(container.firstChild).toHaveClass('primary')
})

test('an uncontrolled checkbox toggles on click and fires onChange(isSelected)', () => {
  const onChange = jest.fn()
  render(<CxFormCheck aria-label="Terms" defaultSelected={false} onChange={onChange} />)
  const input = screen.getByRole('checkbox')
  expect(input).not.toBeChecked()
  fireEvent.click(input)
  expect(input).toBeChecked()
  expect(onChange).toHaveBeenCalledWith(true)
})

test('a controlled checkbox reflects isSelected and fires onChange(isSelected) without changing itself', () => {
  const onChange = jest.fn()
  render(<CxFormCheck aria-label="Terms" isSelected={false} onChange={onChange} />)
  const input = screen.getByRole('checkbox')
  fireEvent.click(input)
  expect(onChange).toHaveBeenCalledWith(true)
  // Still false — the consumer owns the state and hasn't re-rendered with isSelected={true}.
  expect(input).not.toBeChecked()
})

test('indeterminate is synced onto the native input by the checkbox hook', () => {
  render(<CxFormCheck aria-label="Select all" indeterminate />)
  const input = screen.getByRole('checkbox') as HTMLInputElement
  expect(input.indeterminate).toBe(true)
})

test('a radio shares the same isSelected/defaultSelected/onChange(boolean) shape, translated from the native event', () => {
  const onChange = jest.fn()
  render(
    <CxFormCheck
      aria-label="Option A"
      defaultSelected={false}
      name="options"
      onChange={onChange}
      type="radio"
    />,
  )
  const input = screen.getByRole('radio')
  expect(input).not.toBeChecked()
  fireEvent.click(input)
  expect(input).toBeChecked()
  expect(onChange).toHaveBeenCalledWith(true)
})

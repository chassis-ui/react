import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { CxFormRadio, CxFormRadioGroup } from '../../../index'

test('loads and displays CxFormRadio inside a CxFormRadioGroup', async () => {
  const { container } = render(
    <CxFormRadioGroup aria-label="Options" defaultValue="a">
      <CxFormRadio value="a" label="Option A" />
      <CxFormRadio value="b" label="Option B" />
    </CxFormRadioGroup>
  )
  expect(container).toMatchSnapshot()
})

test('CxFormRadio throws when rendered outside a CxFormRadioGroup', () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  expect(() => render(<CxFormRadio value="a" label="Option A" />)).toThrow(
    'CxFormRadio must be rendered inside a CxFormRadioGroup.'
  )
  consoleError.mockRestore()
})

test('CxFormRadio customize', async () => {
  render(
    <CxFormRadioGroup aria-label="Options" defaultValue="a">
      <CxFormRadio className="bazinga" context="secondary" id="id" label="label" value="a" />
    </CxFormRadioGroup>
  )
  const radio = screen.getByRole('radio')
  expect(radio).toHaveAttribute('id', 'id')
  const checkInput = radio.parentElement
  expect(checkInput).toHaveClass('check-input')
  expect(checkInput).toHaveClass('secondary')
  expect(checkInput?.parentElement).toHaveClass('bazinga')
})

test('CxFormRadio button variant', async () => {
  render(
    <CxFormRadioGroup aria-label="Options" defaultValue="a">
      <CxFormRadio
        button={{ context: 'primary', size: 'large', shape: 'rounded', variant: 'ghost' }}
        label="label"
        value="a"
      />
    </CxFormRadioGroup>
  )
  const radio = screen.getByRole('radio')
  expect(radio.parentElement).toHaveClass('button')
  expect(radio.parentElement).toHaveClass('button-check')
  expect(radio.parentElement).toHaveClass('primary')
})

test('an uncontrolled radio group toggles selection on click and fires onChange(value)', () => {
  const onChange = jest.fn()
  render(
    <CxFormRadioGroup aria-label="Options" defaultValue="a" onChange={onChange}>
      <CxFormRadio value="a" label="Option A" />
      <CxFormRadio value="b" label="Option B" />
    </CxFormRadioGroup>
  )
  const a = screen.getByRole('radio', { name: 'Option A' })
  const b = screen.getByRole('radio', { name: 'Option B' })
  expect(a).toBeChecked()
  expect(b).not.toBeChecked()

  fireEvent.click(b)
  expect(onChange).toHaveBeenCalledWith('b')
  expect(b).toBeChecked()
  expect(a).not.toBeChecked()
})

test('a controlled radio group reflects value and fires onChange(value) without changing itself', () => {
  const onChange = jest.fn()
  render(
    <CxFormRadioGroup aria-label="Options" value="a" onChange={onChange}>
      <CxFormRadio value="a" label="Option A" />
      <CxFormRadio value="b" label="Option B" />
    </CxFormRadioGroup>
  )
  const b = screen.getByRole('radio', { name: 'Option B' })
  fireEvent.click(b)
  expect(onChange).toHaveBeenCalledWith('b')
  // Still unchecked — the consumer owns the state and hasn't re-rendered with value="b".
  expect(b).not.toBeChecked()
})

test('disabling a single radio only disables that option', () => {
  render(
    <CxFormRadioGroup aria-label="Options" defaultValue="a">
      <CxFormRadio value="a" label="Option A" />
      <CxFormRadio value="b" label="Option B" disabled />
    </CxFormRadioGroup>
  )
  expect(screen.getByRole('radio', { name: 'Option A' })).toBeEnabled()
  expect(screen.getByRole('radio', { name: 'Option B' })).toBeDisabled()
})

test('disabling the group disables every radio', () => {
  render(
    <CxFormRadioGroup aria-label="Options" defaultValue="a" disabled>
      <CxFormRadio value="a" label="Option A" />
      <CxFormRadio value="b" label="Option B" />
    </CxFormRadioGroup>
  )
  expect(screen.getByRole('radio', { name: 'Option A' })).toBeDisabled()
  expect(screen.getByRole('radio', { name: 'Option B' })).toBeDisabled()
})

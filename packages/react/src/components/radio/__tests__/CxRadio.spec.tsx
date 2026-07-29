import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { CxRadio, CxRadioGroup } from '../../../index'

test('loads and displays CxRadio inside a CxRadioGroup', async () => {
  const { container } = render(
    <CxRadioGroup aria-label="Options" defaultValue="a">
      <CxRadio value="a" label="Option A" />
      <CxRadio value="b" label="Option B" />
    </CxRadioGroup>
  )
  expect(container).toMatchSnapshot()
})

test('CxRadio throws when rendered outside a CxRadioGroup', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
  // React's dev-mode guarded-callback replay dispatches this render error as a
  // real DOM "error" event so jsdom can report it; suppress it here since the
  // throw is expected and already asserted below.
  const onWindowError = (event: ErrorEvent) => event.preventDefault()
  window.addEventListener('error', onWindowError)

  expect(() => render(<CxRadio value="a" label="Option A" />)).toThrow(
    'CxRadio must be rendered inside a CxRadioGroup.'
  )

  window.removeEventListener('error', onWindowError)
  consoleError.mockRestore()
})

test('CxRadio customize', async () => {
  render(
    <CxRadioGroup aria-label="Options" defaultValue="a">
      <CxRadio className="bazinga" context="secondary" id="id" label="label" value="a" />
    </CxRadioGroup>
  )
  const radio = screen.getByRole('radio')
  expect(radio).toHaveAttribute('id', 'id')
  const checkInput = radio.parentElement
  expect(checkInput).toHaveClass('check-input')
  expect(checkInput).toHaveClass('secondary')
  expect(checkInput?.parentElement).toHaveClass('bazinga')
})

test('CxRadio button variant', async () => {
  render(
    <CxRadioGroup aria-label="Options" defaultValue="a">
      <CxRadio
        button={{ context: 'primary', size: 'large', shape: 'rounded', variant: 'ghost' }}
        label="label"
        value="a"
      />
    </CxRadioGroup>
  )
  const radio = screen.getByRole('radio')
  expect(radio.parentElement).toHaveClass('button')
  expect(radio.parentElement).toHaveClass('button-check')
  expect(radio.parentElement).toHaveClass('primary')
})

test('an uncontrolled radio group toggles selection on click and fires onChange(value)', () => {
  const onChange = vi.fn()
  render(
    <CxRadioGroup aria-label="Options" defaultValue="a" onChange={onChange}>
      <CxRadio value="a" label="Option A" />
      <CxRadio value="b" label="Option B" />
    </CxRadioGroup>
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
  const onChange = vi.fn()
  render(
    <CxRadioGroup aria-label="Options" value="a" onChange={onChange}>
      <CxRadio value="a" label="Option A" />
      <CxRadio value="b" label="Option B" />
    </CxRadioGroup>
  )
  const b = screen.getByRole('radio', { name: 'Option B' })
  fireEvent.click(b)
  expect(onChange).toHaveBeenCalledWith('b')
  // Still unchecked — the consumer owns the state and hasn't re-rendered with value="b".
  expect(b).not.toBeChecked()
})

test('disabling a single radio only disables that option', () => {
  render(
    <CxRadioGroup aria-label="Options" defaultValue="a">
      <CxRadio value="a" label="Option A" />
      <CxRadio value="b" label="Option B" disabled />
    </CxRadioGroup>
  )
  expect(screen.getByRole('radio', { name: 'Option A' })).toBeEnabled()
  expect(screen.getByRole('radio', { name: 'Option B' })).toBeDisabled()
})

test('disabling the group disables every radio', () => {
  render(
    <CxRadioGroup aria-label="Options" defaultValue="a" disabled>
      <CxRadio value="a" label="Option A" />
      <CxRadio value="b" label="Option B" />
    </CxRadioGroup>
  )
  expect(screen.getByRole('radio', { name: 'Option A' })).toBeDisabled()
  expect(screen.getByRole('radio', { name: 'Option B' })).toBeDisabled()
})

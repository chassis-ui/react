import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'

import { CxCombobox, CxComboboxItem } from '../../../index'

const BasicCombobox = (props: Partial<React.ComponentProps<typeof CxCombobox>> = {}) => (
  <CxCombobox aria-label="Fruit" {...props}>
    <CxComboboxItem id="apple">Apple</CxComboboxItem>
    <CxComboboxItem id="banana">Banana</CxComboboxItem>
    <CxComboboxItem id="cherry" disabled>
      Cherry
    </CxComboboxItem>
  </CxCombobox>
)

// react-aria's combobox checks real DOM focus state (not just a synthetic focus event) before
// opening the menu on focus — jsdom's `fireEvent.focus` alone doesn't move `document.activeElement`.
const focusInput = (input: HTMLElement) => {
  act(() => input.focus())
  fireEvent.focus(input)
}

test('renders a combobox input with correct ARIA roles', async () => {
  render(<BasicCombobox />)
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  expect(input).toBeInTheDocument()
  expect(input).toHaveClass('combobox-value')
})

test('the listbox is hidden until the input is focused/opened', async () => {
  render(<BasicCombobox />)
  const listbox = document.querySelector('[role="listbox"]') as HTMLElement
  expect(listbox).toHaveAttribute('hidden')
  const input = screen.getByRole('combobox')
  focusInput(input)
  expect(listbox).not.toHaveAttribute('hidden')
  expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
})

test('typing filters the option list', async () => {
  render(<BasicCombobox />)
  const input = screen.getByRole('combobox')
  focusInput(input)
  fireEvent.change(input, { target: { value: 'ban' } })
  expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()
  expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument()
})

test('shows the no-results message when nothing matches', async () => {
  render(<BasicCombobox />)
  const input = screen.getByRole('combobox')
  focusInput(input)
  fireEvent.change(input, { target: { value: 'zzz' } })
  expect(screen.getByText('No results found')).toBeInTheDocument()
})

test('clicking an option selects it, sets the input value, and closes the listbox', async () => {
  const onChange = jest.fn()
  render(<BasicCombobox onChange={onChange} />)
  const input = screen.getByRole('combobox') as HTMLInputElement
  focusInput(input)
  fireEvent.click(screen.getByRole('option', { name: 'Banana' }))
  expect(onChange).toHaveBeenCalledWith('banana')
  expect(input.value).toBe('Banana')
  const listbox = document.querySelector('[role="listbox"]') as HTMLElement
  expect(listbox).toHaveAttribute('hidden')
})

test('disabled options cannot be selected', async () => {
  const onChange = jest.fn()
  render(<BasicCombobox onChange={onChange} />)
  const input = screen.getByRole('combobox')
  focusInput(input)
  const cherry = screen.getByRole('option', { name: 'Cherry' })
  expect(cherry).toHaveAttribute('aria-disabled', 'true')
  fireEvent.click(cherry)
  expect(onChange).not.toHaveBeenCalled()
})

test('creates a hidden input for form submission when name is provided', async () => {
  const { container, rerender } = render(<BasicCombobox name="fruit" value="apple" />)
  const hidden = container.querySelector('input[type="hidden"][name="fruit"]') as HTMLInputElement
  expect(hidden).toBeInTheDocument()
  expect(hidden.value).toBe('apple')

  rerender(<BasicCombobox name="fruit" value="banana" />)
  expect(hidden.value).toBe('banana')
})

test('supports controlled value', async () => {
  const onChange = jest.fn()
  const { rerender } = render(<BasicCombobox value="apple" onChange={onChange} />)
  const input = screen.getByRole('combobox') as HTMLInputElement
  expect(input.value).toBe('Apple')

  rerender(<BasicCombobox value="banana" onChange={onChange} />)
  expect(input.value).toBe('Banana')
})

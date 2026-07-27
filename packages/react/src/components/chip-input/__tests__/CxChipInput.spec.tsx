import * as React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'

import { CxChipInput } from '../../../index'

test('renders a labeled group with a ghost input', () => {
  // react-aria's useTagGroup renders role="group" while empty and role="grid" once it has tags —
  // real grid semantics don't apply to an empty collection.
  render(<CxChipInput aria-label="Skills" />)
  expect(screen.getByRole('group', { name: 'Skills' })).toBeInTheDocument()
  expect(screen.getByRole('textbox')).toBeInTheDocument()
})

test('the group becomes a grid once it has tags', () => {
  render(<CxChipInput aria-label="Skills" defaultValue={['React']} />)
  expect(screen.getByRole('grid', { name: 'Skills' })).toBeInTheDocument()
})

test('typing a value and pressing Enter creates a chip', () => {
  const onChange = jest.fn()
  render(<CxChipInput aria-label="Skills" onChange={onChange} />)
  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: 'React' } })
  fireEvent.keyDown(input, { key: 'Enter' })
  expect(onChange).toHaveBeenCalledWith(['React'])
  expect(screen.getByRole('row', { name: /React/ })).toBeInTheDocument()
  expect(input).toHaveValue('')
})

test('typing the separator character creates a chip', () => {
  const onChange = jest.fn()
  render(<CxChipInput aria-label="Skills" onChange={onChange} />)
  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: 'React' } })
  fireEvent.keyDown(input, { key: ',' })
  expect(onChange).toHaveBeenCalledWith(['React'])
})

test('pasting separator-delimited text creates multiple chips', () => {
  const onChange = jest.fn()
  render(<CxChipInput aria-label="Skills" onChange={onChange} />)
  const input = screen.getByRole('textbox') as HTMLInputElement
  fireEvent.paste(input, {
    clipboardData: { getData: () => 'React,TypeScript,CSS' }
  })
  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(['React', 'TypeScript'])
  expect(input.value).toBe('CSS')
})

test('duplicate values are rejected unless allowDuplicates is set', () => {
  const onChange = jest.fn()
  render(<CxChipInput aria-label="Skills" defaultValue={['React']} onChange={onChange} />)
  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: 'React' } })
  fireEvent.keyDown(input, { key: 'Enter' })
  expect(onChange).not.toHaveBeenCalled()
})

test('maxChips prevents adding beyond the limit', () => {
  const onChange = jest.fn()
  render(
    <CxChipInput aria-label="Skills" defaultValue={['React']} maxChips={1} onChange={onChange} />
  )
  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: 'CSS' } })
  fireEvent.keyDown(input, { key: 'Enter' })
  expect(onChange).not.toHaveBeenCalled()
})

test('clicking a chip close button removes it', () => {
  const onChange = jest.fn()
  render(
    <CxChipInput aria-label="Skills" defaultValue={['React', 'TypeScript']} onChange={onChange} />
  )
  const row = screen.getByRole('row', { name: /React/ })
  const removeButton = within(row).getByRole('button')
  fireEvent.click(removeButton)
  expect(onChange).toHaveBeenCalledWith(['TypeScript'])
})

test('backspace on an empty input focuses and selects the last chip', () => {
  render(<CxChipInput aria-label="Skills" defaultValue={['React', 'TypeScript']} />)
  const input = screen.getByRole('textbox')
  fireEvent.keyDown(input, { key: 'Backspace' })
  const lastRow = screen.getByRole('row', { name: /TypeScript/ })
  expect(lastRow).toHaveFocus()
})

test('pressing Backspace with a chip focused removes it', () => {
  const onChange = jest.fn()
  render(
    <CxChipInput aria-label="Skills" defaultValue={['React', 'TypeScript']} onChange={onChange} />
  )
  const input = screen.getByRole('textbox')
  fireEvent.keyDown(input, { key: 'Backspace' })
  const lastRow = screen.getByRole('row', { name: /TypeScript/ })
  fireEvent.keyDown(lastRow, { key: 'Backspace' })
  expect(onChange).toHaveBeenCalledWith(['React'])
})

test('creates a hidden input per chip for form submission when name is provided', () => {
  const { container } = render(
    <CxChipInput aria-label="Skills" defaultValue={['React', 'TypeScript']} name="skills" />
  )
  const hiddenInputs = container.querySelectorAll('input[type="hidden"][name="skills"]')
  expect(hiddenInputs).toHaveLength(2)
  expect((hiddenInputs[0] as HTMLInputElement).value).toBe('React')
  expect((hiddenInputs[1] as HTMLInputElement).value).toBe('TypeScript')
})

test('supports controlled value', () => {
  const onChange = jest.fn()
  const { rerender } = render(
    <CxChipInput aria-label="Skills" onChange={onChange} value={['React']} />
  )
  expect(screen.getByRole('row', { name: /React/ })).toBeInTheDocument()

  rerender(<CxChipInput aria-label="Skills" onChange={onChange} value={['React', 'CSS']} />)
  expect(screen.getByRole('row', { name: /CSS/ })).toBeInTheDocument()
})

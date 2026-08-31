import * as React from 'react'
import { act } from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ChipInput } from '../../../src/index'

describe('ChipInput', () => {
  describe('rendering', () => {
    test('renders a labeled group with a ghost input', () => {
      // react-aria's useTagGroup renders role="group" while empty and role="grid" once it has
      // tags — real grid semantics don't apply to an empty collection.
      render(<ChipInput aria-label="Skills" />)
      expect(screen.getByRole('group', { name: 'Skills' })).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    test('the group becomes a grid once it has tags', () => {
      render(<ChipInput aria-label="Skills" defaultValue={['React']} />)
      expect(screen.getByRole('grid', { name: 'Skills' })).toBeInTheDocument()
    })
  })

  describe('creating chips', () => {
    test('typing a value and pressing Enter creates a chip', () => {
      const onChange = vi.fn()
      render(<ChipInput aria-label="Skills" onChange={onChange} />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'React' } })
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(onChange).toHaveBeenCalledWith(['React'])
      expect(screen.getByRole('row', { name: /React/ })).toBeInTheDocument()
      expect(input).toHaveValue('')
    })

    test('typing the separator character creates a chip', () => {
      const onChange = vi.fn()
      render(<ChipInput aria-label="Skills" onChange={onChange} />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'React' } })
      fireEvent.keyDown(input, { key: ',' })
      expect(onChange).toHaveBeenCalledWith(['React'])
    })

    test('pasting separator-delimited text creates multiple chips', () => {
      const onChange = vi.fn()
      render(<ChipInput aria-label="Skills" onChange={onChange} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      fireEvent.paste(input, {
        clipboardData: { getData: () => 'React,TypeScript,CSS' }
      })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(['React', 'TypeScript'])
      expect(input.value).toBe('CSS')
    })

    test('duplicate values are rejected unless allowDuplicates is set', () => {
      const onChange = vi.fn()
      render(<ChipInput aria-label="Skills" defaultValue={['React']} onChange={onChange} />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'React' } })
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(onChange).not.toHaveBeenCalled()
    })

    test('maxChips prevents adding beyond the limit', () => {
      const onChange = vi.fn()
      render(
        <ChipInput aria-label="Skills" defaultValue={['React']} maxChips={1} onChange={onChange} />
      )
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'CSS' } })
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(onChange).not.toHaveBeenCalled()
    })

    test('pasting beyond maxChips keeps the untaken values in the input instead of discarding them', () => {
      const onChange = vi.fn()
      render(<ChipInput aria-label="Skills" maxChips={2} onChange={onChange} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      fireEvent.paste(input, {
        clipboardData: { getData: () => 'React,TypeScript,CSS,HTML' }
      })
      expect(onChange).toHaveBeenCalledWith(['React', 'TypeScript'])
      // CSS and HTML couldn't fit — they stay in the input rather than being silently dropped.
      expect(input.value).toBe('CSS,HTML')
    })

    test('allowDuplicates lets the same value be added more than once', () => {
      const onChange = vi.fn()
      render(
        <ChipInput
          aria-label="Skills"
          allowDuplicates
          defaultValue={['React']}
          onChange={onChange}
        />
      )
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'React' } })
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(onChange).toHaveBeenCalledWith(['React', 'React'])
      expect(screen.getAllByRole('row', { name: 'React' })).toHaveLength(2)
    })
  })

  describe('removing chips', () => {
    test('clicking a chip close button removes it', () => {
      const onChange = vi.fn()
      render(
        <ChipInput aria-label="Skills" defaultValue={['React', 'TypeScript']} onChange={onChange} />
      )
      const row = screen.getByRole('row', { name: /React/ })
      const removeButton = within(row).getByRole('button')
      fireEvent.click(removeButton)
      expect(onChange).toHaveBeenCalledWith(['TypeScript'])
    })

    test('backspace on an empty input focuses and selects the last chip', () => {
      render(<ChipInput aria-label="Skills" defaultValue={['React', 'TypeScript']} />)
      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Backspace' })
      const lastRow = screen.getByRole('row', { name: /TypeScript/ })
      expect(lastRow).toHaveFocus()
    })

    test('pressing Backspace with a chip focused removes it', () => {
      const onChange = vi.fn()
      render(
        <ChipInput aria-label="Skills" defaultValue={['React', 'TypeScript']} onChange={onChange} />
      )
      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Backspace' })
      const lastRow = screen.getByRole('row', { name: /TypeScript/ })
      fireEvent.keyDown(lastRow, { key: 'Backspace' })
      expect(onChange).toHaveBeenCalledWith(['React'])
    })

    test('removing one duplicate-valued chip only removes that instance, not every chip with the same value', () => {
      const onChange = vi.fn()
      render(
        <ChipInput
          aria-label="Skills"
          allowDuplicates
          defaultValue={['React', 'React', 'CSS']}
          onChange={onChange}
        />
      )
      const rows = screen.getAllByRole('row', { name: 'React' })
      expect(rows).toHaveLength(2)
      fireEvent.click(within(rows[0]!).getByRole('button'))
      expect(onChange).toHaveBeenCalledWith(['React', 'CSS'])
    })
  })

  describe('chip-focused keyboard navigation', () => {
    test('ArrowLeft/ArrowRight move focus between chips', () => {
      render(<ChipInput aria-label="Skills" defaultValue={['React', 'TypeScript', 'CSS']} />)
      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Backspace' })
      const cssRow = screen.getByRole('row', { name: 'CSS' })
      fireEvent.keyDown(cssRow, { key: 'ArrowLeft' })
      expect(screen.getByRole('row', { name: 'TypeScript' })).toHaveFocus()
      fireEvent.keyDown(screen.getByRole('row', { name: 'TypeScript' }), { key: 'ArrowRight' })
      expect(screen.getByRole('row', { name: 'CSS' })).toHaveFocus()
    })

    test('Shift+ArrowLeft extends selection across multiple chips, and Backspace removes them all', () => {
      const onChange = vi.fn()
      render(
        <ChipInput
          aria-label="Skills"
          defaultValue={['React', 'TypeScript', 'CSS']}
          onChange={onChange}
        />
      )
      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Backspace' })
      const cssRow = screen.getByRole('row', { name: 'CSS' })
      fireEvent.keyDown(cssRow, { key: 'ArrowLeft', shiftKey: true })
      expect(screen.getByRole('row', { name: 'TypeScript' })).toHaveAttribute(
        'aria-selected',
        'true'
      )
      expect(screen.getByRole('row', { name: 'CSS' })).toHaveAttribute('aria-selected', 'true')

      fireEvent.keyDown(screen.getByRole('row', { name: 'TypeScript' }), { key: 'Backspace' })
      expect(onChange).toHaveBeenCalledWith(['React'])
    })

    test('Ctrl+A selects all chips, and Backspace removes them all', () => {
      const onChange = vi.fn()
      render(
        <ChipInput
          aria-label="Skills"
          defaultValue={['React', 'TypeScript', 'CSS']}
          onChange={onChange}
        />
      )
      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Backspace' })
      const cssRow = screen.getByRole('row', { name: 'CSS' })
      fireEvent.keyDown(cssRow, { key: 'a', ctrlKey: true })
      for (const row of screen.getAllByRole('row')) {
        expect(row).toHaveAttribute('aria-selected', 'true')
      }
      fireEvent.keyDown(cssRow, { key: 'Backspace' })
      expect(onChange).toHaveBeenCalledWith([])
    })

    test('Escape on a focused chip clears its selection', () => {
      render(<ChipInput aria-label="Skills" defaultValue={['React', 'TypeScript']} />)
      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Backspace' })
      const lastRow = screen.getByRole('row', { name: /TypeScript/ })
      expect(lastRow).toHaveAttribute('aria-selected', 'true')
      fireEvent.keyDown(lastRow, { key: 'Escape' })
      expect(lastRow).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('keyboard shortcuts on the input itself', () => {
    test('ArrowLeft with the caret at the start focuses the last chip', () => {
      render(<ChipInput aria-label="Skills" defaultValue={['React', 'TypeScript']} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      input.focus()
      fireEvent.keyDown(input, { key: 'ArrowLeft' })
      const lastRow = screen.getByRole('row', { name: /TypeScript/ })
      expect(lastRow).toHaveFocus()
      expect(lastRow).toHaveAttribute('aria-selected', 'true')
    })

    test('Shift+ArrowLeft with the caret at the start extends selection onto the last chip', () => {
      render(<ChipInput aria-label="Skills" defaultValue={['React', 'TypeScript']} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      input.focus()
      fireEvent.keyDown(input, { key: 'ArrowLeft', shiftKey: true })
      const lastRow = screen.getByRole('row', { name: /TypeScript/ })
      expect(lastRow).toHaveFocus()
      expect(lastRow).toHaveAttribute('aria-selected', 'true')
    })

    test('ArrowLeft is ignored when the caret is not at the start', () => {
      render(<ChipInput aria-label="Skills" defaultValue={['React', 'TypeScript']} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      input.focus()
      fireEvent.change(input, { target: { value: 'abc' } })
      input.setSelectionRange(1, 1)
      fireEvent.keyDown(input, { key: 'ArrowLeft' })
      expect(input).toHaveFocus()
    })

    test('Escape on the input clears its value without touching chip selection', () => {
      render(<ChipInput aria-label="Skills" defaultValue={['React']} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'abc' } })
      expect(input).toHaveValue('abc')
      fireEvent.keyDown(input, { key: 'Escape' })
      expect(input).toHaveValue('')
    })

    test('an unhandled key on the input is a no-op', () => {
      render(<ChipInput aria-label="Skills" defaultValue={['React']} />)
      const input = screen.getByRole('textbox')
      expect(() => fireEvent.keyDown(input, { key: 'a' })).not.toThrow()
    })

    test('focusing the input clears any existing chip selection', () => {
      render(<ChipInput aria-label="Skills" defaultValue={['React', 'TypeScript']} />)
      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Backspace' })
      const lastRow = screen.getByRole('row', { name: /TypeScript/ })
      expect(lastRow).toHaveAttribute('aria-selected', 'true')

      act(() => input.focus())
      expect(lastRow).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('disabled state', () => {
    test('applies the disabled class to existing chips, not just the container', () => {
      render(<ChipInput aria-label="Skills" defaultValue={['React']} disabled />)
      const row = screen.getByRole('row', { name: /React/ })
      expect(row).toHaveClass('disabled')
    })

    test('omits the remove button from existing chips', () => {
      render(<ChipInput aria-label="Skills" defaultValue={['React']} disabled />)
      const row = screen.getByRole('row', { name: /React/ })
      expect(within(row).queryByRole('button')).toBeNull()
    })

    test('disables every duplicate-valued chip, not just the first occurrence', () => {
      render(
        <ChipInput aria-label="Skills" allowDuplicates defaultValue={['React', 'React']} disabled />
      )
      for (const row of screen.getAllByRole('row', { name: 'React' })) {
        expect(row).toHaveClass('disabled')
        expect(row).toHaveAttribute('tabIndex', '-1')
      }
    })
  })

  describe('form integration', () => {
    test('creates a hidden input per chip for form submission when name is provided', () => {
      const { container } = render(
        <ChipInput aria-label="Skills" defaultValue={['React', 'TypeScript']} name="skills" />
      )
      // Hidden inputs are intentionally excluded from the accessibility tree - no query reaches
      // them.
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const hiddenInputs = container.querySelectorAll('input[type="hidden"][name="skills"]')
      expect(hiddenInputs).toHaveLength(2)
      expect((hiddenInputs[0] as HTMLInputElement).value).toBe('React')
      expect((hiddenInputs[1] as HTMLInputElement).value).toBe('TypeScript')
    })

    test('supports controlled value', () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <ChipInput aria-label="Skills" onChange={onChange} value={['React']} />
      )
      expect(screen.getByRole('row', { name: /React/ })).toBeInTheDocument()

      rerender(<ChipInput aria-label="Skills" onChange={onChange} value={['React', 'CSS']} />)
      expect(screen.getByRole('row', { name: /CSS/ })).toBeInTheDocument()
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<ChipInput aria-label="Skills" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<ChipInput label="Skills" />)
      const input = screen.getByRole('textbox', { name: 'Skills' })
      // Same class-only wrapper as above - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Skills').tagName).toBe('LABEL')
    })

    // FORMS.md gotcha #5: useTextField's own dev-mode check only sees the ghost input's own
    // aria-label/aria-labelledby, not the separately-rendered <FormLabel htmlFor>, so it must be
    // fed the merged labelledBy explicitly or it false-positives on every `label`-only render.
    test('does not trigger the react-aria missing-accessible-name warning when only label is set', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      render(<ChipInput label="Skills" />)
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<ChipInput aria-label="Skills" help="Some help" />)
      const input = screen.getByRole('textbox', { name: 'Skills' })
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(input.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby, and sets aria-invalid and the is-invalid class, only when invalid', () => {
      const { rerender } = render(<ChipInput aria-label="Skills" invalidFeedback="Required" />)
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<ChipInput aria-label="Skills" invalid invalidFeedback="Required" />)
      const input = screen.getByRole('textbox', { name: 'Skills' })
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input.getAttribute('aria-describedby')).toContain(feedback.id)
      // The .chip-input wrapper has no role/name of its own - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.closest('.chip-input')).toHaveClass('is-invalid')
    })

    test('renders valid feedback and applies the is-valid class only when valid', () => {
      render(<ChipInput aria-label="Skills" valid validFeedback="Looks good" />)
      const input = screen.getByRole('textbox', { name: 'Skills' })
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.closest('.chip-input')).toHaveClass('is-valid')
    })

    test('does not leak raw aria-describedby/aria-labelledby onto the .chip-input wrapper', () => {
      // Only the real focusable ghost input is the accessible-name/-description target - the
      // wrapper div spreads the remaining native attributes and must not also carry these,
      // duplicated and unmerged with the generated help/label ids.
      render(
        <ChipInput
          aria-describedby="external-desc"
          aria-labelledby="external-label"
          help="Some help"
        />
      )
      const input = screen.getByRole('textbox')
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = input.closest('.chip-input')
      expect(wrapper).not.toHaveAttribute('aria-describedby')
      expect(wrapper).not.toHaveAttribute('aria-labelledby')
      expect(input.getAttribute('aria-describedby')).toContain('external-desc')
      expect(input).toHaveAttribute('aria-labelledby', 'external-label')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with chips present', async () => {
      const { container } = render(<ChipInput aria-label="Skills" defaultValue={['React']} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

import * as React from 'react'
import { act } from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { ChipInput, FloatingInput } from '../../../src/index'

describe('ChipInput', () => {
  describe('rendering', () => {
    test('renders a labeled group with a ghost input', () => {
      // react-aria's useTagGroup renders role="group" while empty and role="grid" once it has
      // tags — real grid semantics don't apply to an empty collection.
      render(<ChipInput aria-label="Skills" />)
      expect(screen.getByRole('group', { name: 'Skills' })).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    // The empty group renders nothing: as a tab stop it took a Tab with nothing to show for it.
    test('Tab goes straight to the input while there are no chips', async () => {
      const user = userEvent.setup()
      render(
        <>
          <button type="button">Before</button>
          <ChipInput aria-label="Tags" />
        </>
      )
      act(() => screen.getByRole('button', { name: 'Before' }).focus())
      await user.tab()
      expect(screen.getByRole('textbox')).toHaveFocus()
      expect(screen.getByRole('group', { name: 'Tags' })).toHaveAttribute('tabindex', '-1')
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

    // Enter cleared the text it didn't add, where a paste keeps what it can't take.
    test.each([
      ['Enter', '{Enter}'],
      ['the separator', ',']
    ])('at maxChips, %s keeps the text it cannot add', async (_key, keys) => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <ChipInput aria-label="Skills" defaultValue={['React']} maxChips={1} onChange={onChange} />
      )
      await user.type(screen.getByRole('textbox'), `CSS${keys}`)
      expect(onChange).not.toHaveBeenCalled()
      expect(screen.getByRole('textbox')).toHaveValue('CSS')
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

    // react-aria focuses the list once its last chip is gone, and the empty list renders nothing.
    test('removing the last chip with Backspace leaves the focus in the input', async () => {
      const user = userEvent.setup()
      render(<ChipInput aria-label="Tags" defaultValue={['a']} />)
      const input = screen.getByRole('textbox')
      await user.click(input)
      await user.keyboard('{Backspace}')
      expect(screen.getByRole('row', { name: 'a' })).toHaveFocus()
      await user.keyboard('{Backspace}')
      expect(screen.queryByRole('row')).not.toBeInTheDocument()
      expect(input).toHaveFocus()
    })

    test('removing the last chip with its close button leaves the focus in the input', async () => {
      const user = userEvent.setup()
      render(<ChipInput aria-label="Tags" defaultValue={['a']} />)
      await user.click(within(screen.getByRole('row', { name: 'a' })).getByRole('button'))
      expect(screen.queryByRole('row')).not.toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveFocus()
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

  // The chips had no reset of their own: after a chip was added and the form reset, the form
  // still submitted it.
  describe('form reset', () => {
    test('puts the chips back to their first value and clears the text', async () => {
      const user = userEvent.setup()
      render(
        <form aria-label="Profile">
          <ChipInput aria-label="Skills" defaultValue={['React']} name="skills" />
          <button type="reset">Reset</button>
        </form>
      )
      const form = screen.getByRole<HTMLFormElement>('form', { name: 'Profile' })
      await user.click(screen.getByRole('textbox', { name: 'Skills' }))
      await user.keyboard('CSS{Enter}')
      expect(new FormData(form).getAll('skills')).toEqual(['React', 'CSS'])
      await user.keyboard('Sa')

      await user.click(screen.getByRole('button', { name: 'Reset' }))
      expect(new FormData(form).getAll('skills')).toEqual(['React'])
      expect(screen.queryByRole('row', { name: /CSS/ })).not.toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: 'Skills' })).toHaveValue('')
    })
  })

  // The chip input had no `required` at all: nothing marked it for a screen reader or held a
  // form back, and the chips' own inputs are `type="hidden"`, which a form doesn't validate.
  describe('required', () => {
    const Profile = ({
      onSubmit = () => undefined,
      ...props
    }: React.ComponentProps<typeof ChipInput> & { onSubmit?: () => void }) => (
      <form
        aria-label="Profile"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <ChipInput label="Skills" name="skills" {...props} />
        <button type="submit">Save</button>
      </form>
    )
    const form = () => screen.getByRole<HTMLFormElement>('form', { name: 'Profile' })
    const input = () => screen.getByRole<HTMLInputElement>('textbox', { name: 'Skills' })
    const save = () => screen.getByRole('button', { name: 'Save' })
    // react-aria listens for `invalid` on the input and updates its validation state.
    const checkValidity = () => {
      let valid = true
      act(() => {
        valid = form().checkValidity()
      })
      return valid
    }
    const submitted = () => [...new FormData(form()).entries()]
    // What each case below is told apart from: a required chip input with no chips, which holds
    // its form back. Rendered first, then the case in its place.
    const insteadOfEmpty = (ui: React.ReactElement) => {
      const { unmount } = render(<Profile required />)
      expect(checkValidity()).toBe(false)
      unmount()
      return render(ui)
    }

    test('with no chips it holds its form back, and its input takes focus', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<Profile onSubmit={onSubmit} required />)

      expect(checkValidity()).toBe(false)
      await user.click(save())
      expect(onSubmit).not.toHaveBeenCalled()
      expect(input()).toHaveFocus()
    })

    // Required asks for one chip, which HTML has no attribute for: the input carries the native
    // `required` while there are none, as each checkbox of a required `CheckboxGroup` does while
    // none is checked. With chips it is `aria-required` that still says the field is required.
    test('is required natively while it has no chips, and by aria-required once it has', async () => {
      const user = userEvent.setup()
      render(<Profile required />)
      expect(input()).toHaveAttribute('required')
      expect(input()).not.toHaveAttribute('aria-required')

      await user.type(input(), 'React{Enter}')
      expect(input()).not.toHaveAttribute('required')
      expect(input()).toHaveAttribute('aria-required', 'true')
      expect(input()).toBeRequired()
    })

    test('says so only while it is required', () => {
      const { rerender } = render(<Profile required />)
      expect(input()).toBeRequired()
      rerender(<Profile />)
      expect(input()).not.toBeRequired()
    })

    test('submits once a chip is added, and is held back again once the last is removed', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<Profile onSubmit={onSubmit} required />)
      expect(checkValidity()).toBe(false)
      await user.type(input(), 'React{Enter}')

      expect(checkValidity()).toBe(true)
      await user.click(save())
      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(submitted()).toEqual([['skills', 'React']])

      await user.click(
        within(screen.getByRole('row', { name: /React/ })).getByRole('button', { name: /Remove/ })
      )
      expect(submitted()).toEqual([])
      expect(checkValidity()).toBe(false)
    })

    test('submits the chips it was given', () => {
      insteadOfEmpty(<Profile defaultValue={['React']} required />)
      expect(checkValidity()).toBe(true)
    })

    test.each([
      ['disabled', { disabled: true, required: true }],
      ['not required', {}]
    ])('a %s one holds nothing back', (_state, props) => {
      insteadOfEmpty(<Profile {...props} />)
      expect(checkValidity()).toBe(true)
    })

    // The input isn't empty, so the native attribute alone would let the form go, with nothing
    // under `name`.
    test('text typed and never added as a chip is not a value', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<Profile onSubmit={onSubmit} required />)
      await user.type(input(), 'React')
      expect(input()).toHaveValue('React')
      expect(submitted()).toEqual([])
      expect(input().validity.valueMissing).toBe(false)
      expect(input().validity.customError).toBe(true)

      await user.click(save())
      expect(onSubmit).not.toHaveBeenCalled()
      expect(input()).toHaveFocus()

      await user.type(input(), '{Enter}')
      expect(submitted()).toEqual([['skills', 'React']])
      expect(input().validity.customError).toBe(false)
      await user.click(save())
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    // The custom validity was cleared in a passive effect, after the mark had read the input's
    // validity: the chip that satisfied the field left it marked.
    test('the chip that satisfies it clears the mark of a submit it held back', async () => {
      const user = userEvent.setup()
      render(<Profile required />)
      await user.type(input(), 'React')
      await user.click(save())
      expect(input()).toHaveAttribute('aria-invalid', 'true')

      await user.type(input(), '{Enter}')
      expect(input()).not.toHaveAttribute('aria-invalid')
    })

    test('text typed beside a chip, or in a field that is not required, holds nothing back', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<Profile required value={[]} />)
      await user.type(input(), 'Vue')
      expect(input().validity.customError).toBe(true)

      rerender(<Profile required value={['React']} />)
      expect(input()).toHaveValue('Vue')
      expect(input().validity.customError).toBe(false)
      expect(checkValidity()).toBe(true)

      rerender(<Profile value={[]} />)
      expect(input()).toHaveValue('Vue')
      expect(checkValidity()).toBe(true)
    })

    test('holds the form back with no name', () => {
      render(<Profile name={undefined} required />)
      expect(checkValidity()).toBe(false)
    })

    test('has no axe violations while required and invalid, and logs no error', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      const { container } = render(<Profile invalid invalidFeedback="Add a skill." required />)
      expect(checkValidity()).toBe(false)
      expect(input()).toHaveAccessibleDescription('Add a skill.')
      expect(await axe(container)).toHaveNoViolations()
      expect(consoleError).not.toHaveBeenCalled()
      consoleError.mockRestore()
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

  describe('inside a FloatingInput', () => {
    // The fallback `aria-label` looked at the raw `label` and `aria-labelledby` props, not at
    // the label a `FloatingInput` hands down: the input kept "Add value", which react-aria puts
    // in front of the label, and was named "Add value Skills".
    test('is named by the floating label alone, without the fallback aria-label', () => {
      render(
        <FloatingInput label="Skills">
          <ChipInput />
        </FloatingInput>
      )
      const input = screen.getByRole('textbox', { name: 'Skills' })
      expect(input).not.toHaveAttribute('aria-label')
    })

    test('keeps the fallback aria-label with no label of any kind', () => {
      render(<ChipInput />)
      expect(screen.getByRole('textbox', { name: 'Add value' })).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with chips present', async () => {
      const { container } = render(<ChipInput aria-label="Skills" defaultValue={['React']} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

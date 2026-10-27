import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Autocomplete, AutocompleteGroup, AutocompleteItem } from '../../../src/index'

const BasicAutocomplete = (props: Partial<React.ComponentProps<typeof Autocomplete>> = {}) => (
  <Autocomplete aria-label="Fruit" {...props}>
    <AutocompleteItem id="apple">Apple</AutocompleteItem>
    <AutocompleteItem id="banana">Banana</AutocompleteItem>
    <AutocompleteItem id="cherry" disabled>
      Cherry
    </AutocompleteItem>
  </Autocomplete>
)

const openMenu = () => {
  fireEvent.click(screen.getByRole('button'))
}

// The `.menu` panel is a plain wrapper `<div>` with no role/name of its own (the real
// role="listbox" lives one level inside, on ComboboxListBox's own element via react-aria's
// useListBox) — so there's no accessible query that reaches the panel itself to check things
// like its `hidden` attribute.
const getListboxWrapper = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector('.menu') as HTMLElement

describe('Autocomplete', () => {
  describe('rendering', () => {
    test('renders a toggle button showing the placeholder when nothing is selected', () => {
      render(<BasicAutocomplete placeholder="Select a fruit…" />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('form-input', 'combobox')
      expect(button).toHaveTextContent('Select a fruit…')
    })

    test('the listbox is hidden until the toggle is activated', () => {
      render(<BasicAutocomplete />)
      expect(getListboxWrapper()).toHaveAttribute('hidden')
      openMenu()
      expect(getListboxWrapper()).not.toHaveAttribute('hidden')
      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
    })

    test('the search field autofocuses when the menu opens', () => {
      render(<BasicAutocomplete />)
      openMenu()
      expect(screen.getByRole('combobox')).toHaveFocus()
    })

    // Regression test: `useComboBox`'s own `buttonProps` sets `excludeFromTabOrder: true` by
    // default (correct for its usual "auxiliary button beside an always-visible input" use
    // case, wrong here — before opening, the toggle is the *only* focusable element, since the
    // search input lives inside the still-`hidden` panel). Without overriding it back to
    // reachable, this control is entirely unreachable via sequential Tab navigation.
    test('the toggle is reachable via sequential Tab navigation (not excluded from the tab order)', () => {
      render(<BasicAutocomplete />)
      const button = screen.getByRole('button')
      expect(button).not.toHaveAttribute('tabindex', '-1')
    })
  })

  describe('filtering', () => {
    test('typing in the search field filters the option list', () => {
      render(<BasicAutocomplete />)
      openMenu()
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ban' } })
      expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument()
    })

    test('shows the no-results message when nothing matches', () => {
      render(<BasicAutocomplete />)
      openMenu()
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } })
      expect(screen.getByText('No results found')).toBeInTheDocument()
    })
  })

  describe('rich item content', () => {
    test('an explicit textValue filters non-string children', () => {
      render(
        <Autocomplete aria-label="Role">
          <AutocompleteItem id="admin" textValue="Administrator">
            <strong>Admin</strong>
          </AutocompleteItem>
          <AutocompleteItem id="viewer">Viewer</AutocompleteItem>
        </Autocomplete>
      )
      openMenu()
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Admin' } })
      expect(screen.getByRole('option', { name: 'Admin' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Viewer' })).not.toBeInTheDocument()
    })

    test('items prop textValue filters non-string labels the same way', () => {
      render(
        <Autocomplete
          aria-label="Role"
          items={[
            { id: 'admin', label: <strong>Admin</strong>, textValue: 'Administrator' },
            { id: 'viewer', label: 'Viewer' }
          ]}
        />
      )
      openMenu()
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Admin' } })
      expect(screen.getByRole('option', { name: 'Admin' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Viewer' })).not.toBeInTheDocument()
    })
  })

  describe('single-select behavior', () => {
    test('clicking an option selects it, updates the toggle text, and closes the listbox', () => {
      const onChange = vi.fn()
      render(<BasicAutocomplete onChange={onChange} />)
      openMenu()
      fireEvent.click(screen.getByRole('option', { name: 'Banana' }))
      expect(onChange).toHaveBeenCalledWith('banana')
      expect(screen.getByRole('button')).toHaveTextContent('Banana')
      expect(getListboxWrapper()).toHaveAttribute('hidden')
    })

    test('closing returns focus to the toggle button', () => {
      render(<BasicAutocomplete />)
      openMenu()
      fireEvent.click(screen.getByRole('option', { name: 'Banana' }))
      expect(screen.getByRole('button')).toHaveFocus()
    })

    test('disabled options cannot be selected', () => {
      const onChange = vi.fn()
      render(<BasicAutocomplete onChange={onChange} />)
      openMenu()
      const cherry = screen.getByRole('option', { name: 'Cherry' })
      expect(cherry).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(cherry)
      expect(onChange).not.toHaveBeenCalled()
    })

    test('supports controlled value', () => {
      const onChange = vi.fn()
      const { rerender } = render(<BasicAutocomplete value="apple" onChange={onChange} />)
      expect(screen.getByRole('button')).toHaveTextContent('Apple')

      rerender(<BasicAutocomplete value="banana" onChange={onChange} />)
      expect(screen.getByRole('button')).toHaveTextContent('Banana')
    })

    test('the whole autocomplete can be disabled', () => {
      render(<BasicAutocomplete disabled />)
      // The toggle is a `<div role="button">`, not a real `<button>` (see Autocomplete.tsx's
      // doc comment) - a div has no native `disabled` attribute, so `useButton` communicates it
      // via `aria-disabled` instead, matching how any non-native `elementType` button works.
      const toggle = screen.getByRole('button')
      expect(toggle).toHaveAttribute('aria-disabled', 'true')
      expect(toggle).toHaveClass('disabled')
    })
  })

  // The search field held the selected option's text: react-stately's combobox treats its input
  // as the value's text. After choosing Banana, reopening showed "Banana" in the field, what was
  // typed was appended to it so nothing matched, and emptying the field cleared the selection.
  describe('the search field is a query', () => {
    test('it is empty when the list opens again after a selection', async () => {
      const user = userEvent.setup()
      render(<BasicAutocomplete />)
      await user.click(screen.getByRole('button'))
      await user.click(screen.getByRole('option', { name: 'Banana' }))
      await user.click(screen.getByRole('button'))

      expect(screen.getByRole('combobox')).toHaveValue('')
      await user.keyboard('app')
      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Banana' })).not.toBeInTheDocument()
    })

    test('emptying it leaves the selection alone', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<BasicAutocomplete onChange={onChange} />)
      await user.click(screen.getByRole('button'))
      await user.click(screen.getByRole('option', { name: 'Banana' }))
      await user.click(screen.getByRole('button'))
      await user.keyboard('ba')
      await user.clear(screen.getByRole('combobox'))
      await user.keyboard('{Escape}')

      expect(onChange.mock.calls).toEqual([['banana']])
      expect(screen.getByRole('button')).toHaveTextContent('Banana')
    })

    test('what was typed is gone once the list closes', async () => {
      const user = userEvent.setup()
      render(<BasicAutocomplete />)
      await user.click(screen.getByRole('button'))
      await user.keyboard('ban')
      await user.keyboard('{Escape}')
      await user.click(screen.getByRole('button'))

      expect(screen.getByRole('combobox')).toHaveValue('')
      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
    })
  })

  // `value={null}` was read as no `value` at all, so the selection went uncontrolled and a parent
  // could not clear the toggle.
  test('a controlled value of null clears the selection', () => {
    const { rerender } = render(<BasicAutocomplete placeholder="Pick one" value="apple" />)
    expect(screen.getByRole('button')).toHaveTextContent('Apple')

    rerender(<BasicAutocomplete placeholder="Pick one" value={null} />)
    expect(screen.getByRole('button')).toHaveTextContent('Pick one')
  })

  test('a selection under value={null} waits for the parent', () => {
    const onChange = vi.fn()
    render(<BasicAutocomplete onChange={onChange} placeholder="Pick one" value={null} />)
    openMenu()
    fireEvent.click(screen.getByRole('option', { name: 'Banana' }))

    expect(onChange).toHaveBeenCalledWith('banana')
    expect(screen.getByRole('button')).toHaveTextContent('Pick one')
  })

  describe('multi-select behavior', () => {
    const MultiAutocomplete = (props: Partial<React.ComponentProps<typeof Autocomplete>> = {}) => (
      <Autocomplete aria-label="Fruit" multiple {...props}>
        <AutocompleteItem id="apple">Apple</AutocompleteItem>
        <AutocompleteItem id="banana">Banana</AutocompleteItem>
        <AutocompleteItem id="cherry">Cherry</AutocompleteItem>
      </Autocomplete>
    )

    const getToggle = () => screen.getByRole('button', { name: 'Fruit' })
    const openMultiMenu = () => fireEvent.click(getToggle())

    test('selecting more than one option accumulates the selection and shows "N selected"', () => {
      const onChange = vi.fn()
      render(<MultiAutocomplete onChange={onChange} />)
      openMultiMenu()
      fireEvent.click(screen.getByRole('option', { name: 'Apple' }))
      expect(getToggle()).toHaveTextContent('Apple')
      fireEvent.click(screen.getByRole('option', { name: 'Banana' }))
      expect(onChange).toHaveBeenLastCalledWith(['apple', 'banana'])
      expect(getToggle()).toHaveTextContent('2 selected')
    })

    test('the menu stays open after a selection', () => {
      render(<MultiAutocomplete />)
      openMultiMenu()
      fireEvent.click(screen.getByRole('option', { name: 'Apple' }))
      expect(getListboxWrapper()).not.toHaveAttribute('hidden')
    })

    test('clicking an already-selected option again deselects it', () => {
      const onChange = vi.fn()
      render(<MultiAutocomplete onChange={onChange} value={['apple', 'banana']} />)
      openMultiMenu()
      fireEvent.click(screen.getByRole('option', { name: 'Apple' }))
      expect(onChange).toHaveBeenLastCalledWith(['banana'])
    })

    test('Backspace in the empty search field removes the last selected option', () => {
      const onChange = vi.fn()
      render(<MultiAutocomplete onChange={onChange} value={['apple', 'banana']} />)
      openMultiMenu()
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Backspace' })
      expect(onChange).toHaveBeenLastCalledWith(['apple'])
    })

    test('Backspace does not remove a selected option while the search field has text', () => {
      const onChange = vi.fn()
      render(<MultiAutocomplete onChange={onChange} value={['apple', 'banana']} />)
      openMultiMenu()
      const search = screen.getByRole('combobox')
      fireEvent.change(search, { target: { value: 'a' } })
      fireEvent.keyDown(search, { key: 'Backspace' })
      expect(onChange).not.toHaveBeenCalled()
    })

    test('the listbox is aria-multiselectable', () => {
      render(<MultiAutocomplete />)
      openMultiMenu()
      expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true')
    })
  })

  describe('form integration', () => {
    test('creates a hidden input for form submission when name is provided', () => {
      // Hidden inputs are intentionally excluded from the accessibility tree - no query reaches
      // them.
      const { container, rerender } = render(<BasicAutocomplete name="fruit" value="apple" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const hidden = container.querySelector(
        'input[type="hidden"][name="fruit"]'
      ) as HTMLInputElement
      expect(hidden).toBeInTheDocument()
      expect(hidden.value).toBe('apple')

      rerender(<BasicAutocomplete name="fruit" value="banana" />)
      expect(hidden.value).toBe('banana')
    })

    test('creates one hidden input per selected key in multi-select mode', () => {
      const { container } = render(
        <Autocomplete aria-label="Fruit" multiple name="fruit" value={['apple', 'banana']}>
          <AutocompleteItem id="apple">Apple</AutocompleteItem>
          <AutocompleteItem id="banana">Banana</AutocompleteItem>
        </Autocomplete>
      )

      // Hidden inputs are intentionally excluded from the accessibility tree - no query reaches
      // them.
      const hiddenInputs = [
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        ...container.querySelectorAll('input[type="hidden"][name="fruit"]')
      ] as HTMLInputElement[]
      expect(hiddenInputs.map((input) => input.value)).toEqual(['apple', 'banana'])
    })
  })

  // The selection had no reset of its own: after a choice and a reset, the form still submitted
  // the chosen key.
  describe('form reset', () => {
    test('puts the selection back to its first value', () => {
      const onChange = vi.fn()
      render(
        <form aria-label="Basket">
          <Autocomplete aria-label="Fruit" defaultValue="apple" name="fruit" onChange={onChange}>
            <AutocompleteItem id="apple">Apple</AutocompleteItem>
            <AutocompleteItem id="banana">Banana</AutocompleteItem>
          </Autocomplete>
          <button type="reset">Reset</button>
        </form>
      )
      const form = screen.getByRole<HTMLFormElement>('form', { name: 'Basket' })
      const toggle = screen.getByRole('button', { name: /Fruit/ })
      fireEvent.click(toggle)
      fireEvent.click(screen.getByRole('option', { name: 'Banana' }))
      expect(new FormData(form).get('fruit')).toBe('banana')
      expect(toggle).toHaveTextContent('Banana')

      fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
      expect(new FormData(form).get('fruit')).toBe('apple')
      expect(onChange).toHaveBeenLastCalledWith('apple')
      expect(toggle).toHaveTextContent('Apple')
    })
  })

  // The autocomplete had no `required` at all: nothing marked it for a screen reader, and its
  // value input was `type="hidden"`, which a form doesn't validate, so one with nothing selected
  // was submitted.
  describe('required', () => {
    const Order = ({
      onSubmit = () => undefined,
      ...props
    }: Partial<React.ComponentProps<typeof Autocomplete>> & { onSubmit?: () => void }) => (
      <form
        aria-label="Order"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <BasicAutocomplete
          aria-label={undefined}
          invalidFeedback="Pick a fruit."
          label="Fruit"
          name="fruit"
          {...props}
        />
        <button type="submit">Save</button>
        <button type="reset">Reset</button>
      </form>
    )
    const form = () => screen.getByRole<HTMLFormElement>('form', { name: 'Order' })
    const toggle = () => screen.getByRole('button', { name: 'Fruit' })
    const save = () => screen.getByRole('button', { name: 'Save' })
    const select = (name: string) => {
      fireEvent.click(toggle())
      fireEvent.click(screen.getByRole('option', { name }))
    }
    // `checkValidity()` fires `invalid` at the field's input, as a submit does, and the field
    // marks itself on it: a state update.
    const checkValidity = () => {
      let valid = true
      act(() => {
        valid = form().checkValidity()
      })
      return valid
    }
    const submitted = () => [...new FormData(form()).entries()]
    // What each case below is told apart from: a required autocomplete with nothing selected,
    // which holds its form back. Rendered first, then the case in its place.
    const insteadOfEmpty = (ui: React.ReactElement, empty: React.ReactElement) => {
      const { unmount } = render(empty)
      expect(checkValidity()).toBe(false)
      unmount()
      return render(ui)
    }

    describe.each([
      ['single', {}],
      ['multiple', { multiple: true }]
    ])('%s', (_mode, mode) => {
      test('with nothing selected it holds its form back, and its toggle takes focus', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<Order onSubmit={onSubmit} required {...mode} />)

        expect(checkValidity()).toBe(false)
        await user.click(save())
        expect(onSubmit).not.toHaveBeenCalled()
        expect(toggle()).toHaveFocus()
      })

      test('submits once an option is selected', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<Order onSubmit={onSubmit} required {...mode} />)
        expect(checkValidity()).toBe(false)
        select('Apple')

        expect(checkValidity()).toBe(true)
        await user.click(save())
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(submitted()).toEqual([['fruit', 'apple']])
      })

      test('submits a value it was given', () => {
        insteadOfEmpty(
          <Order defaultValue="banana" required {...mode} />,
          <Order required {...mode} />
        )
        expect(checkValidity()).toBe(true)
        expect(submitted()).toEqual([['fruit', 'banana']])
      })

      test.each([
        ['disabled', { disabled: true, required: true }],
        ['not required', {}]
      ])('a %s one holds nothing back', (_state, props) => {
        insteadOfEmpty(<Order {...props} {...mode} />, <Order required {...mode} />)
        expect(checkValidity()).toBe(true)
      })

      test('holds the form back with no name, and submits nothing of its own', () => {
        render(<Order name={undefined} required {...mode} />)
        expect(checkValidity()).toBe(false)
        select('Apple')
        expect(checkValidity()).toBe(true)
        expect(submitted()).toEqual([])
      })

      // The browser has no bubble to show on an input that isn't displayed.
      test('shows as invalid after the submit it held back, until an option is selected', async () => {
        const user = userEvent.setup()
        render(<Order required {...mode} />)
        expect(toggle()).not.toHaveClass('is-invalid')
        expect(screen.queryByText('Pick a fruit.')).not.toBeInTheDocument()

        await user.click(save())
        expect(toggle()).toHaveClass('form-input', 'combobox', 'is-invalid')
        expect(toggle()).toHaveAttribute('aria-invalid', 'true')
        expect(screen.getByText('Pick a fruit.')).toHaveClass('invalid-feedback')
        expect(toggle()).toHaveAccessibleDescription('Pick a fruit.')

        select('Apple')
        expect(toggle()).not.toHaveClass('is-invalid')
        expect(toggle()).not.toHaveAttribute('aria-invalid')
        expect(screen.queryByText('Pick a fruit.')).not.toBeInTheDocument()
      })

      test("the mark clears on the form's reset, and the form is still held back", async () => {
        const user = userEvent.setup()
        render(<Order required {...mode} />)
        await user.click(save())
        expect(toggle()).toHaveClass('is-invalid')

        await user.click(screen.getByRole('button', { name: 'Reset' }))
        expect(toggle()).not.toHaveClass('is-invalid')
        expect(checkValidity()).toBe(false)
      })

      // The caller's own state wins: `invalid` once it is set, to `false` too, and `valid`.
      test.each([
        ['invalid={false}', { invalid: false }],
        ['valid', { valid: true }]
      ])('%s keeps the field as the caller shows it', async (_name, props) => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        const { rerender } = render(<Order onSubmit={onSubmit} required {...props} {...mode} />)
        await user.click(save())
        expect(onSubmit).not.toHaveBeenCalled()
        expect(toggle()).not.toHaveClass('is-invalid')
        expect(screen.queryByText('Pick a fruit.')).not.toBeInTheDocument()

        // The submit was held back all the same: the mark shows once the caller lets go.
        rerender(<Order onSubmit={onSubmit} required {...mode} />)
        expect(toggle()).toHaveClass('is-invalid')
      })

      test('has no axe violations while marked, and logs no error', async () => {
        const user = userEvent.setup()
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
        const { container } = render(<Order required {...mode} />)
        await user.click(save())
        expect(toggle()).toHaveClass('is-invalid')
        expect(await axe(container)).toHaveNoViolations()
        expect(consoleError).not.toHaveBeenCalled()
        consoleError.mockRestore()
      })
    })

    // The toggle is a button, which ARIA gives no required state: the search input, the field's
    // `combobox`, says it.
    test('says it is required on the search input', () => {
      const { rerender } = render(<Order required />)
      fireEvent.click(toggle())
      expect(screen.getByRole('combobox')).toBeRequired()
      expect(toggle()).not.toHaveAttribute('aria-required')

      rerender(<Order />)
      expect(screen.getByRole('combobox')).not.toBeRequired()
    })

    // The value input of one mode isn't the element of the other.
    test('still marks itself after `multiple` changes', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<Order required />)
      rerender(<Order multiple required />)
      await user.click(save())
      expect(toggle()).toHaveClass('is-invalid')

      await user.click(screen.getByRole('button', { name: 'Reset' }))
      expect(toggle()).not.toHaveClass('is-invalid')
      rerender(<Order required />)
      await user.click(save())
      expect(toggle()).toHaveClass('is-invalid')
    })

    test('multiple: deselecting the last option holds the form back again', () => {
      render(<Order multiple required />)
      select('Apple')
      expect(checkValidity()).toBe(true)

      // The list stays open in this mode.
      fireEvent.click(screen.getByRole('option', { name: 'Apple' }))
      expect(submitted()).toEqual([])
      expect(checkValidity()).toBe(false)
    })
  })

  describe('grouped items', () => {
    const GroupedAutocomplete = (
      props: Partial<React.ComponentProps<typeof Autocomplete>> = {}
    ) => (
      <Autocomplete aria-label="Language" {...props}>
        <AutocompleteGroup label="Frontend">
          <AutocompleteItem id="html">HTML</AutocompleteItem>
          <AutocompleteItem id="css">CSS</AutocompleteItem>
        </AutocompleteGroup>
        <AutocompleteItem id="python">Python</AutocompleteItem>
      </Autocomplete>
    )

    test('renders a non-interactive header with role=presentation per group', () => {
      render(<GroupedAutocomplete />)
      openMenu()
      expect(screen.getByText('Frontend')).toHaveAttribute('role', 'presentation')
      expect(screen.getByRole('option', { name: 'HTML' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Python' })).toBeInTheDocument()
    })

    test('items prop wins over children and supports header-driven grouping', () => {
      render(
        <Autocomplete
          aria-label="Language"
          items={[
            { type: 'header', id: 'g1', label: 'Frontend' },
            { id: 'html', label: 'HTML' }
          ]}
        >
          <AutocompleteItem id="ignored">Ignored</AutocompleteItem>
        </Autocomplete>
      )
      openMenu()
      expect(screen.getByText('Frontend')).toHaveAttribute('role', 'presentation')
      expect(screen.getByRole('option', { name: 'HTML' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Ignored' })).not.toBeInTheDocument()
    })
  })

  describe('field wrapping', () => {
    // The toggle is a `role="button"` `<div>`, not a labelable element — `<label for>` can't
    // target it (and shouldn't target the hidden search input either, which sits inert until
    // the popover opens). Association goes through `aria-labelledby` instead, so the accessible
    // name query below is the real assertion: it only finds the toggle if that association
    // actually works, the same way DatePicker/OtpInput's `role="group"` pattern is verified.
    test('wraps in .form-field and associates the label via aria-labelledby when label is set', () => {
      render(<BasicAutocomplete aria-label={undefined} label="Fruit" />)
      const button = screen.getByRole('button', { name: 'Fruit' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(button.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Fruit').tagName).toBe('LABEL')
      expect(screen.getByText('Fruit')).not.toHaveAttribute('for')
    })
  })

  // Closing always focused the toggle: leaving the open search field for another field, by a
  // press there or by Tab, closed the list and pulled focus straight back.
  describe('focus when the list closes', () => {
    const renderBesideField = () => {
      render(
        <>
          <BasicAutocomplete />
          <input aria-label="Notes" />
        </>
      )
      // Read before the list opens: while it is open, react-aria hides everything else from
      // assistive technology, role queries included.
      return {
        notes: screen.getByRole('textbox', { name: 'Notes' }),
        toggle: screen.getByRole('button', { name: 'Fruit' })
      }
    }

    test('stays on another field the user pressed', async () => {
      const user = userEvent.setup()
      const { notes, toggle } = renderBesideField()
      await user.click(toggle)
      expect(screen.getByRole('combobox')).toHaveFocus()

      await user.click(notes)
      expect(getListboxWrapper()).toHaveAttribute('hidden')
      expect(notes).toHaveFocus()
    })

    test('stays on another field the user tabbed to', async () => {
      const user = userEvent.setup()
      const { notes, toggle } = renderBesideField()
      await user.click(toggle)
      expect(screen.getByRole('combobox')).toHaveFocus()

      // The list is portaled to the end of the body, so the field before it is one Shift+Tab away.
      await user.tab({ shift: true })
      expect(getListboxWrapper()).toHaveAttribute('hidden')
      expect(notes).toHaveFocus()
    })

    test('returns to the toggle when Escape closes the list', async () => {
      const user = userEvent.setup()
      const { toggle } = renderBesideField()
      await user.click(toggle)
      await user.keyboard('{Escape}')
      expect(getListboxWrapper()).toHaveAttribute('hidden')
      expect(toggle).toHaveFocus()
    })
  })

  // The toggle's own props were spread after the caller's, replacing `onClick`, `onKeyDown` and
  // `onFocus` instead of running beside them.
  describe('handlers on the toggle', () => {
    test("runs the caller's onFocus, onKeyDown and onClick, and still opens the list", async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      const onFocus = vi.fn()
      const onKeyDown = vi.fn()
      render(<BasicAutocomplete onClick={onClick} onFocus={onFocus} onKeyDown={onKeyDown} />)
      const toggle = screen.getByRole('button', { name: 'Fruit' })

      await user.tab()
      expect(toggle).toHaveFocus()
      expect(onFocus).toHaveBeenCalledTimes(1)

      await user.keyboard('a')
      expect(onKeyDown).toHaveBeenCalledTimes(1)

      await user.click(toggle)
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(getListboxWrapper()).not.toHaveAttribute('hidden')
    })

    test('a disabled toggle stays out of the tab order, whatever tabIndex the caller gives', () => {
      render(<BasicAutocomplete disabled tabIndex={0} />)
      expect(screen.getByRole('button', { name: 'Fruit' })).not.toHaveAttribute('tabindex')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the toggle, which keeps opening the list', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<BasicAutocomplete ref={ref} />)
      expect(ref.current).toBe(screen.getByRole('button', { name: 'Fruit' }))
      openMenu()
      expect(getListboxWrapper()).not.toHaveAttribute('hidden')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with the listbox open', async () => {
      const { container } = render(<BasicAutocomplete />)
      openMenu()
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations in multi-select mode with a selection and the listbox open', async () => {
      const { container } = render(
        <Autocomplete aria-label="Fruit" multiple value={['apple', 'banana']}>
          <AutocompleteItem id="apple">Apple</AutocompleteItem>
          <AutocompleteItem id="banana">Banana</AutocompleteItem>
        </Autocomplete>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Fruit' }))
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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

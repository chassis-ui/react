import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { renderToString as toHtml } from 'react-dom/server'

import { Combobox, ComboboxGroup, ComboboxItem } from '../../../src/index'
import { danglingReferences } from '../../utils/danglingReferences'

const BasicCombobox = (props: Partial<React.ComponentProps<typeof Combobox>> = {}) => (
  <Combobox aria-label="Fruit" {...props}>
    <ComboboxItem id="apple">Apple</ComboboxItem>
    <ComboboxItem id="banana">Banana</ComboboxItem>
    <ComboboxItem id="cherry" disabled>
      Cherry
    </ComboboxItem>
  </Combobox>
)

// react-aria's combobox checks real DOM focus state (not just a synthetic focus event) before
// opening the menu on focus — jsdom's `fireEvent.focus` alone doesn't move `document.activeElement`.
const focusInput = (input: HTMLElement) => {
  act(() => input.focus())
  fireEvent.focus(input)
}

// The `.menu` panel is a plain wrapper `<div>` with no role/name of its own (the real
// role="listbox" lives one level inside, on ComboboxListBox's own element via react-aria's
// useListBox) — so there's no accessible query that reaches the panel itself to check things
// like its `hidden` attribute.
const getListboxWrapper = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector('.menu') as HTMLElement

describe('Combobox', () => {
  describe('rendering', () => {
    test('renders a combobox input with correct ARIA roles', () => {
      render(<BasicCombobox />)
      const input = screen.getByRole('combobox', { name: 'Fruit' })
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('combobox-value')
    })

    test('the listbox is hidden until the input is focused/opened', () => {
      render(<BasicCombobox />)
      expect(getListboxWrapper()).toHaveAttribute('hidden')
      focusInput(screen.getByRole('combobox'))
      expect(getListboxWrapper()).not.toHaveAttribute('hidden')
      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
    })
  })

  describe('filtering', () => {
    test('typing filters the option list', () => {
      render(<BasicCombobox />)
      const input = screen.getByRole('combobox')
      focusInput(input)
      fireEvent.change(input, { target: { value: 'ban' } })
      expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument()
    })

    test('shows the no-results message when nothing matches', () => {
      render(<BasicCombobox />)
      const input = screen.getByRole('combobox')
      focusInput(input)
      fireEvent.change(input, { target: { value: 'zzz' } })
      expect(screen.getByText('No results found')).toBeInTheDocument()
    })

    // Regression test: the no-results message must be exposed to screen readers, not just
    // sighted users — via an `aria-live` region (so it's announced as it appears) and via the
    // input's own `aria-describedby` (so it's also discoverable on demand).
    test('the no-results message is announced: a live region, and referenced by the input', () => {
      render(<BasicCombobox />)
      const input = screen.getByRole('combobox')
      focusInput(input)
      fireEvent.change(input, { target: { value: 'zzz' } })

      const status = screen.getByRole('status')
      expect(status).toHaveTextContent('No results found')
      expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(status.id))

      fireEvent.change(input, { target: { value: 'ban' } })
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  describe('selection behavior', () => {
    test('clicking an option selects it, sets the input value, and closes the listbox', () => {
      const onChange = vi.fn()
      render(<BasicCombobox onChange={onChange} />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      focusInput(input)
      fireEvent.click(screen.getByRole('option', { name: 'Banana' }))
      expect(onChange).toHaveBeenCalledWith('banana')
      expect(input.value).toBe('Banana')
      expect(getListboxWrapper()).toHaveAttribute('hidden')
    })

    test('disabled options cannot be selected', () => {
      const onChange = vi.fn()
      render(<BasicCombobox onChange={onChange} />)
      const input = screen.getByRole('combobox')
      focusInput(input)
      const cherry = screen.getByRole('option', { name: 'Cherry' })
      expect(cherry).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(cherry)
      expect(onChange).not.toHaveBeenCalled()
    })

    test('supports controlled value', () => {
      const onChange = vi.fn()
      const { rerender } = render(<BasicCombobox value="apple" onChange={onChange} />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      expect(input.value).toBe('Apple')

      rerender(<BasicCombobox value="banana" onChange={onChange} />)
      expect(input.value).toBe('Banana')
    })
  })

  describe('keyboard navigation', () => {
    test('ArrowDown highlights the first option and Enter selects it', () => {
      const onChange = vi.fn()
      render(<BasicCombobox onChange={onChange} />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      focusInput(input)

      fireEvent.keyDown(input, { key: 'ArrowDown' })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(onChange).toHaveBeenCalledWith('apple')
      expect(input.value).toBe('Apple')
      expect(getListboxWrapper()).toHaveAttribute('hidden')
    })
  })

  describe('rich item content', () => {
    const RichCombobox = (props: Partial<React.ComponentProps<typeof Combobox>> = {}) => (
      <Combobox aria-label="Role" {...props}>
        <ComboboxItem id="admin" icon={<span data-testid="icon" />} description="Full access">
          Admin
        </ComboboxItem>
        <ComboboxItem id="viewer">Viewer</ComboboxItem>
      </Combobox>
    )

    test('renders icon and description on an option', () => {
      render(<RichCombobox />)
      focusInput(screen.getByRole('combobox'))
      const option = screen.getByRole('option', { name: 'AdminFull access' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(option.querySelector('.menu-item-icon')).toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(option.querySelector('.menu-item-description')).toHaveTextContent('Full access')
    })

    test('an option without icon/description still filters and renders as plain text', () => {
      render(<RichCombobox />)
      const input = screen.getByRole('combobox')
      focusInput(input)
      fireEvent.change(input, { target: { value: 'view' } })
      expect(screen.getByRole('option', { name: 'Viewer' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'AdminFull access' })).not.toBeInTheDocument()
    })

    test('the selected option shows a check icon, others do not', () => {
      render(<RichCombobox value="admin" />)
      focusInput(screen.getByRole('combobox'))
      const admin = screen.getByRole('option', { name: 'AdminFull access' })
      const viewer = screen.getByRole('option', { name: 'Viewer' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(admin.querySelector('.menu-item-check')).toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(viewer.querySelector('.menu-item-check')).not.toBeInTheDocument()
    })

    test('an explicit textValue filters and drives typeahead for non-string children', () => {
      render(
        <Combobox aria-label="Role">
          <ComboboxItem id="admin" textValue="Administrator">
            <strong>Admin</strong>
          </ComboboxItem>
          <ComboboxItem id="viewer">Viewer</ComboboxItem>
        </Combobox>
      )
      const input = screen.getByRole('combobox')
      focusInput(input)
      fireEvent.change(input, { target: { value: 'Admin' } })
      expect(screen.getByRole('option', { name: 'Admin' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Viewer' })).not.toBeInTheDocument()
    })

    test('items prop textValue filters non-string labels the same way', () => {
      render(
        <Combobox
          aria-label="Role"
          items={[
            { id: 'admin', label: <strong>Admin</strong>, textValue: 'Administrator' },
            { id: 'viewer', label: 'Viewer' }
          ]}
        />
      )
      const input = screen.getByRole('combobox')
      focusInput(input)
      fireEvent.change(input, { target: { value: 'Admin' } })
      expect(screen.getByRole('option', { name: 'Admin' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Viewer' })).not.toBeInTheDocument()
    })
  })

  describe('grouped items', () => {
    const GroupedCombobox = (props: Partial<React.ComponentProps<typeof Combobox>> = {}) => (
      <Combobox aria-label="Language" {...props}>
        <ComboboxGroup label="Frontend">
          <ComboboxItem id="html">HTML</ComboboxItem>
          <ComboboxItem id="css">CSS</ComboboxItem>
        </ComboboxGroup>
        <ComboboxGroup label="Backend">
          <ComboboxItem id="python">Python</ComboboxItem>
          <ComboboxItem id="ruby">Ruby</ComboboxItem>
        </ComboboxGroup>
        <ComboboxItem id="other">Other</ComboboxItem>
      </Combobox>
    )

    test('renders a non-interactive header with role=presentation per group', () => {
      render(<GroupedCombobox />)
      focusInput(screen.getByRole('combobox'))
      const frontendHeader = screen.getByText('Frontend')
      expect(frontendHeader).toHaveAttribute('role', 'presentation')
      expect(frontendHeader).toHaveClass('menu-header')
      expect(screen.getByText('Backend')).toHaveAttribute('role', 'presentation')
      expect(screen.getByRole('option', { name: 'HTML' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Other' })).toBeInTheDocument()
    })

    test('filtering hides an entirely-matched-out group along with its header', () => {
      render(<GroupedCombobox />)
      const input = screen.getByRole('combobox')
      focusInput(input)
      fireEvent.change(input, { target: { value: 'py' } })
      expect(screen.getByRole('option', { name: 'Python' })).toBeInTheDocument()
      expect(screen.getByText('Backend')).toBeInTheDocument()
      expect(screen.queryByText('Frontend')).not.toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'HTML' })).not.toBeInTheDocument()
    })

    test('a query matching nothing in a group hides that header, keeping ungrouped items separate', () => {
      render(<GroupedCombobox />)
      const input = screen.getByRole('combobox')
      focusInput(input)
      fireEvent.change(input, { target: { value: 'other' } })
      expect(screen.getByRole('option', { name: 'Other' })).toBeInTheDocument()
      expect(screen.queryByText('Frontend')).not.toBeInTheDocument()
      expect(screen.queryByText('Backend')).not.toBeInTheDocument()
    })

    test('items prop wins over children and supports header-driven grouping', () => {
      render(
        <Combobox
          aria-label="Language"
          items={[
            { type: 'header', id: 'g1', label: 'Frontend' },
            { id: 'html', label: 'HTML' },
            { type: 'header', id: 'g2', label: 'Backend' },
            { id: 'python', label: 'Python' }
          ]}
        >
          <ComboboxItem id="ignored">Ignored</ComboboxItem>
        </Combobox>
      )
      focusInput(screen.getByRole('combobox'))
      expect(screen.getByText('Frontend')).toHaveAttribute('role', 'presentation')
      expect(screen.getByRole('option', { name: 'HTML' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Python' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Ignored' })).not.toBeInTheDocument()
    })
  })

  describe('form integration', () => {
    test('creates a hidden input for form submission when name is provided', () => {
      // Hidden inputs are intentionally excluded from the accessibility tree - no query reaches
      // them.
      const { container, rerender } = render(<BasicCombobox name="fruit" value="apple" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const hidden = container.querySelector(
        'input[type="hidden"][name="fruit"]'
      ) as HTMLInputElement
      expect(hidden).toBeInTheDocument()
      expect(hidden.value).toBe('apple')

      rerender(<BasicCombobox name="fruit" value="banana" />)
      expect(hidden.value).toBe('banana')
    })

    test('the hidden input is empty when nothing is selected', () => {
      const { container } = render(<BasicCombobox name="fruit" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const hidden = container.querySelector(
        'input[type="hidden"][name="fruit"]'
      ) as HTMLInputElement
      expect(hidden.value).toBe('')
    })
  })

  // The combobox had no `required` at all: nothing marked it for a screen reader or held a form
  // back, and one with nothing selected was submitted.
  describe('required', () => {
    const Order = ({
      onSubmit = () => undefined,
      ...props
    }: Partial<React.ComponentProps<typeof Combobox>> & { onSubmit?: () => void }) => (
      <form
        aria-label="Order"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <BasicCombobox aria-label={undefined} label="Fruit" name="fruit" {...props} />
        <button type="submit">Save</button>
      </form>
    )
    const form = () => screen.getByRole<HTMLFormElement>('form', { name: 'Order' })
    const input = () => screen.getByRole<HTMLInputElement>('combobox', { name: 'Fruit' })
    const save = () => screen.getByRole('button', { name: 'Save' })
    // react-aria listens for `invalid` on the input and updates its validation state.
    const checkValidity = () => {
      let valid = true
      act(() => {
        valid = form().checkValidity()
      })
      return valid
    }
    // What each case below is told apart from: a required combobox with nothing selected, which
    // holds its form back. Rendered first, then the case in its place.
    const insteadOfEmpty = (ui: React.ReactElement) => {
      const { unmount } = render(<Order required />)
      expect(checkValidity()).toBe(false)
      unmount()
      return render(ui)
    }

    test('with nothing selected it holds its form back, and its input takes focus', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<Order onSubmit={onSubmit} required />)

      await user.click(save())
      expect(onSubmit).not.toHaveBeenCalled()
      // react-aria's listener focuses the form's first invalid input, which opens the list.
      expect(input()).toHaveFocus()
      expect(checkValidity()).toBe(false)
    })

    // The native attribute says it, on the element that takes focus: no `aria-required` beside it.
    test('is required natively, on the input', () => {
      const { rerender } = render(<Order required />)
      expect(input()).toBeRequired()
      expect(input()).toHaveAttribute('required')
      expect(input()).not.toHaveAttribute('aria-required')

      rerender(<Order />)
      expect(input()).not.toBeRequired()
    })

    test('submits once an option is selected', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<Order onSubmit={onSubmit} required />)
      // The input takes focus as the first invalid one, which opens the list.
      expect(checkValidity()).toBe(false)
      await user.click(screen.getByRole('option', { name: 'Apple' }))

      expect(checkValidity()).toBe(true)
      await user.click(save())
      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(form()).toHaveFormValues({ fruit: 'apple' })
    })

    test('submits a value it was given', () => {
      insteadOfEmpty(<Order defaultValue="banana" required />)
      expect(checkValidity()).toBe(true)
      expect(form()).toHaveFormValues({ fruit: 'banana' })
    })

    test.each([
      ['disabled', { disabled: true, required: true }],
      ['not required', {}]
    ])('a %s one holds nothing back', (_state, props) => {
      insteadOfEmpty(<Order {...props} />)
      expect(checkValidity()).toBe(true)
    })

    // What a form submits under `name` is the selected option, not the text in the input: text
    // alone would satisfy the native attribute and go with nothing under `name`.
    test('text typed without selecting an option is not a value', async () => {
      const user = userEvent.setup()
      render(<Order required />)
      await user.type(input(), 'ap')
      expect(input()).toHaveValue('ap')
      expect(form()).toHaveFormValues({ fruit: '' })
      expect(checkValidity()).toBe(false)
      expect(input().validity.customError).toBe(true)

      await user.click(screen.getByRole('option', { name: 'Apple' }))
      expect(form()).toHaveFormValues({ fruit: 'apple' })
      expect(input().validity.customError).toBe(false)
      expect(checkValidity()).toBe(true)
    })

    test('text with no selection is only invalid on a required combobox', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<Order required />)
      await user.type(input(), 'ap')
      expect(input().validity.customError).toBe(true)

      rerender(<Order />)
      expect(input()).toHaveValue('ap')
      expect(input().validity.customError).toBe(false)
      expect(checkValidity()).toBe(true)
    })

    test('clearing the text of a selection holds the form back again', async () => {
      const user = userEvent.setup()
      render(<Order defaultValue="banana" required />)
      await user.clear(input())
      expect(form()).toHaveFormValues({ fruit: '' })
      expect(checkValidity()).toBe(false)
    })

    test('holds the form back with no name', () => {
      render(<Order name={undefined} required />)
      expect(checkValidity()).toBe(false)
    })

    test('has no axe violations while required and invalid, and logs no error', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      const { container } = render(<Order invalid invalidFeedback="Pick a fruit." required />)
      expect(checkValidity()).toBe(false)
      expect(input()).toHaveAccessibleDescription('Pick a fruit.')
      expect(await axe(container)).toHaveNoViolations()
      expect(consoleError).not.toHaveBeenCalled()
      consoleError.mockRestore()
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<BasicCombobox />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<BasicCombobox aria-label={undefined} label="Fruit" />)
      const input = screen.getByRole('combobox', { name: 'Fruit' })
      // Same class-only wrapper as above - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Fruit').tagName).toBe('LABEL')
    })

    // FORMS.md gotcha #5: useComboBox's own dev-mode check only sees the DOM node's own
    // aria-label/aria-labelledby, not the separately-rendered <FormLabel htmlFor>, so it must be
    // fed the merged labelledBy explicitly or it false-positives on every `label`-only render.
    test('does not trigger the react-aria missing-accessible-name warning when only label is set', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      render(<BasicCombobox aria-label={undefined} label="Fruit" />)
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<BasicCombobox help="Some help" />)
      const input = screen.getByRole('combobox', { name: 'Fruit' })
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(input.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby, and sets aria-invalid and the is-invalid class, only when invalid', () => {
      const { rerender } = render(<BasicCombobox invalidFeedback="Required" />)
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<BasicCombobox invalid invalidFeedback="Required" />)
      const input = screen.getByRole('combobox', { name: 'Fruit' })
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input.getAttribute('aria-describedby')).toContain(feedback.id)
      // The .combobox wrapper has no role/name of its own - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.closest('.combobox')).toHaveClass('is-invalid')
    })

    test('renders valid feedback and applies the is-valid class only when valid', () => {
      render(<BasicCombobox valid validFeedback="Looks good" />)
      const input = screen.getByRole('combobox', { name: 'Fruit' })
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.closest('.combobox')).toHaveClass('is-valid')
    })

    test('does not leak raw aria-describedby/aria-labelledby onto the .combobox wrapper', () => {
      // Only the real focusable combobox input is the accessible-name/-description target - the
      // wrapper div spreads the remaining native attributes and must not also carry these,
      // duplicated and unmerged with the generated help/label ids.
      render(
        <BasicCombobox
          aria-describedby="external-desc"
          aria-label={undefined}
          aria-labelledby="external-label"
          help="Some help"
        />
      )
      const input = screen.getByRole('combobox')
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = input.closest('.combobox')
      expect(wrapper).not.toHaveAttribute('aria-describedby')
      expect(wrapper).not.toHaveAttribute('aria-labelledby')
      expect(input.getAttribute('aria-describedby')).toContain('external-desc')
      expect(input).toHaveAttribute('aria-labelledby', 'external-label')
    })
  })

  // The no-results message is inside `Portal`, which renders nothing on the server and while
  // hydrating: an empty combobox's server HTML described its input by an id no element had.
  describe('server HTML', () => {
    test('an empty combobox refers to no element its HTML lacks', () => {
      const html = toHtml(<Combobox aria-label="Fruit" />)
      expect(html).not.toContain('No results found')
      expect(danglingReferences(html)).toEqual([])
      expect(html).not.toContain('aria-describedby')
    })

    test('an empty combobox with help is described by the help alone', () => {
      const html = toHtml(<Combobox help="Pick a fruit." label="Fruit" />)
      expect(danglingReferences(html)).toEqual([])
      expect(html).toMatch(/<input[^>]* aria-describedby="[^" ]+"/)
    })

    test('once mounted, an empty combobox is described by its no-results message', () => {
      render(<Combobox aria-label="Fruit" help="Pick a fruit." />)
      expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveAccessibleDescription(
        'Pick a fruit. No results found'
      )
    })
  })

  describe('overlay portal', () => {
    test('the listbox portals to document.body, not clipped by an overflow:hidden ancestor', () => {
      const { container } = render(
        <div style={{ overflow: 'hidden', height: 40 }}>
          <BasicCombobox />
        </div>
      )
      focusInput(screen.getByRole('combobox'))
      const listbox = screen.getByRole('listbox')
      // The clipping ancestor is a plain, role-less wrapper `<div>` - no accessible query reaches
      // it, so this checks containment via the render container instead.
      // eslint-disable-next-line testing-library/no-container
      expect(container.contains(listbox)).toBe(false)
      expect(document.body.contains(listbox)).toBe(true)
    })

    test('scopes itself to an open dialog ancestor instead of document.body', () => {
      render(
        <dialog open>
          <BasicCombobox />
        </dialog>
      )
      focusInput(screen.getByRole('combobox'))
      const dialog = screen.getByRole('dialog')
      const listbox = screen.getByRole('listbox')
      expect(dialog.contains(listbox)).toBe(true)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with the listbox open', async () => {
      render(<BasicCombobox />)
      focusInput(screen.getByRole('combobox'))
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
    })
  })
})

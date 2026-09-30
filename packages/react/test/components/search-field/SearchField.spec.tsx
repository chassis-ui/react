import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { I18nProvider, IconProvider, SearchField } from '../../../src/index'
import type { IconComponentProps } from '../../../src/index'

const getByClass = (className: string) =>
  screen.getByText((_, element) => element?.classList.contains(className) ?? false)

const TestIcon = ({ name, ...props }: IconComponentProps) => (
  <i data-name={name} data-testid="icon" {...props} />
)
const iconNames = () => screen.queryAllByTestId('icon').map((icon) => icon.dataset.name)
const withTestIcons = (element: React.ReactElement) => (
  <IconProvider component={TestIcon}>{element}</IconProvider>
)

describe('SearchField', () => {
  describe('rendering', () => {
    test('renders a search input as a .ghost-input in a .form-input.search-field', () => {
      render(<SearchField aria-label="Search" />)
      const input = screen.getByRole('searchbox', { name: 'Search' })
      expect(input).toHaveAttribute('type', 'search')
      expect(input).toHaveClass('ghost-input')
      expect(input).not.toHaveClass('form-input')
      const wrapper = getByClass('search-field')
      expect(wrapper).toHaveClass('form-input')
      expect(wrapper).toContainElement(input)
    })

    test('draws the search icon at its start, as an .input-adorn hidden from assistive tech', () => {
      render(withTestIcons(<SearchField aria-label="Search" />))
      expect(iconNames()).toEqual(['search-outline'])
      const icon = getByClass('search-field-icon')
      expect(icon).toHaveClass('input-adorn')
      expect(icon).toContainElement(screen.getByTestId('icon'))
      expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true')
    })

    test('takes other icons, and leaves the search icon out with searchIcon={false}', () => {
      const { unmount } = render(
        withTestIcons(
          <SearchField
            aria-label="Search"
            clearIcon="xmark-circle-solid"
            defaultValue="chassis"
            searchIcon="search-solid"
          />
        )
      )
      expect(iconNames()).toEqual(['search-solid', 'xmark-circle-solid'])

      unmount()
      render(withTestIcons(<SearchField aria-label="Search" searchIcon={false} />))
      expect(iconNames()).toEqual([])
    })

    test("uses IconProvider's search and clear icons", () => {
      render(
        <IconProvider component={TestIcon} icons={{ clear: 'times', search: 'magnifier' }}>
          <SearchField aria-label="Search" defaultValue="chassis" />
        </IconProvider>
      )
      expect(iconNames()).toEqual(['magnifier', 'times'])
    })

    test('puts size, className and style on the wrapper, and validation on the input', () => {
      render(
        <SearchField
          aria-label="Search"
          className="custom"
          invalid
          size="lg"
          style={{ maxWidth: '10rem' }}
        />
      )
      const wrapper = getByClass('search-field')
      expect(wrapper).toHaveClass('form-input', 'search-field', 'lg', 'custom')
      expect(wrapper).toHaveAttribute('style', 'max-width: 10rem;')
      const input = screen.getByRole('searchbox')
      expect(input).toHaveClass('is-invalid')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).not.toHaveAttribute('style')
    })

    test('labels and describes the input with label, help and feedback', () => {
      render(
        <SearchField
          help="Pages and posts."
          invalid
          invalidFeedback="Type at least two letters."
          label="Search"
        />
      )
      const input = screen.getByRole('searchbox', { name: 'Search' })
      expect(input).toHaveAccessibleDescription('Pages and posts. Type at least two letters.')
    })
  })

  describe('clearing', () => {
    test('shows the clear button only while the field has a value', async () => {
      const user = userEvent.setup()
      render(<SearchField aria-label="Search" />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      await user.type(screen.getByRole('searchbox'), 'c')
      expect(screen.getByRole('button', { name: 'Clear search' })).toHaveClass(
        'button',
        'icon-only',
        'input-adorn',
        'search-field-clear'
      )
    })

    test('clears the field from the button, keeping focus on the input', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const onClear = vi.fn()
      render(
        <SearchField
          aria-label="Search"
          defaultValue="chassis"
          onChange={onChange}
          onClear={onClear}
        />
      )
      const input = screen.getByRole('searchbox')
      await user.click(input)
      await user.click(screen.getByRole('button', { name: 'Clear search' }))

      expect(input).toHaveValue('')
      expect(input).toHaveFocus()
      expect(onChange).toHaveBeenCalledWith('')
      expect(onClear).toHaveBeenCalledTimes(1)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    test('keeps the clear button out of the tab order, since Escape clears too', async () => {
      const user = userEvent.setup()
      render(
        <>
          <SearchField aria-label="Search" defaultValue="chassis" />
          <button type="button">Next</button>
        </>
      )
      expect(screen.getByRole('button', { name: 'Clear search' })).toHaveAttribute('tabindex', '-1')
      await user.click(screen.getByRole('searchbox'))
      await user.tab()
      expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
    })

    test('clears the field with Escape, and lets Escape through once it is empty', async () => {
      const user = userEvent.setup()
      const onClear = vi.fn()
      const onKeyDown = vi.fn()
      render(
        <div onKeyDown={onKeyDown}>
          <SearchField aria-label="Search" defaultValue="chassis" onClear={onClear} />
        </div>
      )
      await user.click(screen.getByRole('searchbox'))
      await user.keyboard('{Escape}')
      expect(screen.getByRole('searchbox')).toHaveValue('')
      expect(onClear).toHaveBeenCalledTimes(1)
      expect(onKeyDown).not.toHaveBeenCalled()

      await user.keyboard('{Escape}')
      expect(onClear).toHaveBeenCalledTimes(1)
      expect(onKeyDown).toHaveBeenCalledTimes(1)
    })

    test('has no clear button when disabled or read only', () => {
      render(
        <>
          <SearchField aria-label="Disabled" defaultValue="chassis" disabled />
          <SearchField aria-label="Read only" defaultValue="chassis" readOnly />
        </>
      )
      expect(screen.getByRole('searchbox', { name: 'Disabled' })).toBeDisabled()
      expect(screen.getByRole('searchbox', { name: 'Read only' })).toHaveAttribute('readonly')
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    test("names the clear button in the locale's language, or with clearAriaLabel", () => {
      render(
        <I18nProvider locale="de-DE">
          <SearchField aria-label="Suche" defaultValue="chassis" />
          <SearchField aria-label="Filter" clearAriaLabel="Filter leeren" defaultValue="chassis" />
        </I18nProvider>
      )
      expect(screen.getByRole('button', { name: 'Suche zurücksetzen' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Filter leeren' })).toBeInTheDocument()
    })
  })

  describe('value', () => {
    test('reports each change, and follows a controlled value', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const Controlled = () => {
        const [value, setValue] = React.useState('')
        return (
          <SearchField
            aria-label="Search"
            onChange={(next) => {
              onChange(next)
              setValue(next.toLowerCase())
            }}
            value={value}
          />
        )
      }
      render(<Controlled />)
      await user.type(screen.getByRole('searchbox'), 'AB')
      expect(onChange).toHaveBeenLastCalledWith('aB')
      expect(screen.getByRole('searchbox')).toHaveValue('ab')
    })

    test('calls onSubmit with the value on Enter, instead of submitting the form', async () => {
      const user = userEvent.setup()
      const onFormSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
      const onSubmit = vi.fn()
      render(
        <form aria-label="Site search" onSubmit={onFormSubmit}>
          <SearchField aria-label="Search" onSubmit={onSubmit} />
        </form>
      )
      await user.type(screen.getByRole('searchbox'), 'chassis{Enter}')
      expect(onSubmit).toHaveBeenCalledWith('chassis')
      expect(onFormSubmit).not.toHaveBeenCalled()
    })

    test('keeps the form from submitting on Shift+Enter, and in a read-only field', async () => {
      const user = userEvent.setup()
      const onFormSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
      const onSubmit = vi.fn()
      render(
        <form aria-label="Site search" onSubmit={onFormSubmit}>
          <SearchField aria-label="Editable" onSubmit={onSubmit} />
          <SearchField aria-label="Read only" defaultValue="chassis" onSubmit={onSubmit} readOnly />
        </form>
      )
      await user.type(screen.getByRole('searchbox', { name: 'Editable' }), 'react{Shift>}{Enter}')
      expect(onSubmit).toHaveBeenLastCalledWith('react')

      await user.click(screen.getByRole('searchbox', { name: 'Read only' }))
      await user.keyboard('{Enter}')
      expect(onSubmit).toHaveBeenLastCalledWith('chassis')
      expect(onSubmit).toHaveBeenCalledTimes(2)
      expect(onFormSubmit).not.toHaveBeenCalled()
    })

    test('submits its form on Enter without onSubmit, under its name', async () => {
      const user = userEvent.setup()
      let submitted: FormData | undefined
      render(
        <form
          aria-label="Site search"
          onSubmit={(event) => {
            event.preventDefault()
            submitted = new FormData(event.currentTarget)
          }}
        >
          <SearchField aria-label="Search" name="q" />
        </form>
      )
      await user.type(screen.getByRole('searchbox'), 'chassis{Enter}')
      expect(submitted?.get('q')).toBe('chassis')
    })

    test("resets to its default value with the form's reset", () => {
      render(
        <form aria-label="Site search">
          <SearchField aria-label="Search" defaultValue="chassis" />
          <button type="reset">Reset</button>
        </form>
      )
      const input = screen.getByRole('searchbox')
      fireEvent.change(input, { target: { value: 'react' } })
      expect(input).toHaveValue('react')
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
      expect(input).toHaveValue('chassis')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<SearchField aria-label="Search" ref={ref} />)
      expect(ref.current).toBe(screen.getByRole('searchbox'))
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with a label, help, a value and its clear button', async () => {
      const { container } = render(
        <SearchField defaultValue="chassis" help="Pages and posts." label="Search" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

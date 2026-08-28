import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { InputAdorn, Select } from '../../../src/index'

describe('Select', () => {
  describe('rendering', () => {
    test('renders a select with the base class', () => {
      render(
        <Select aria-label="Language">
          <option value="js">JavaScript</option>
        </Select>
      )
      expect(screen.getByRole('combobox', { name: 'Language' })).toHaveClass('form-input')
    })

    test('renders raw option children, including value and text-only options', () => {
      render(
        <Select aria-label="Language">
          <option value="A">B</option>
          <option>C</option>
        </Select>
      )
      const select = screen.getByRole('combobox', { name: 'Language' }) as HTMLSelectElement
      expect(screen.getByRole('option', { name: 'B' })).toHaveValue('A')
      expect(screen.getByRole('option', { name: 'C' })).toHaveValue('C')
      expect(Array.from(select.options).map((option) => option.value)).toEqual(['A', 'C'])
    })

    test('applies a bare size class and className together', () => {
      render(
        <Select aria-label="Language" className="bazinga" size="large">
          <option value="A">B</option>
        </Select>
      )
      const select = screen.getByRole('combobox', { name: 'Language' })
      expect(select).toHaveClass('form-input', 'large', 'bazinga')
      expect(select).not.toHaveClass('form-select', 'form-select-large')
    })

    test('applies invalid/valid classes', () => {
      render(
        <Select aria-label="Language" invalid>
          <option>A</option>
        </Select>
      )
      expect(screen.getByRole('combobox', { name: 'Language' })).toHaveClass('is-invalid')
    })

    test('renders options from a string array', () => {
      render(<Select aria-label="Language" options={['js', 'html']} />)
      expect(screen.getByRole('option', { name: 'js' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'html' })).toBeInTheDocument()
    })

    test('renders options from object definitions, including a disabled option', () => {
      render(
        <Select
          aria-label="Language"
          options={[
            { value: 'js', label: 'JavaScript' },
            { value: 'html', label: 'HTML', disabled: true }
          ]}
        />
      )
      expect(screen.getByRole('option', { name: 'JavaScript' })).toHaveValue('js')
      expect(screen.getByRole('option', { name: 'HTML' })).toBeDisabled()
    })

    test('renders an option with value 0 instead of dropping it', () => {
      render(
        <Select
          aria-label="Language"
          options={[
            { value: 0, label: 'Zero' },
            { value: 1, label: 'One' }
          ]}
        />
      )
      expect(screen.getByRole('option', { name: 'Zero' })).toHaveValue('0')
    })

    test('falls back to the stringified value when an object option omits label', () => {
      render(<Select aria-label="Language" options={[{ value: 'js' }, { value: 0 }]} />)
      expect(screen.getByRole('option', { name: 'js' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: '0' })).toBeInTheDocument()
    })

    test('renders a disabled placeholder option before the given options', () => {
      render(<Select aria-label="Language" placeholder="Select a language…" options={['js']} />)
      const placeholderOption = screen.getByRole('option', { name: 'Select a language…' })
      expect(placeholderOption).toBeDisabled()
      expect(placeholderOption).toHaveValue('')
    })

    test('renders an option with `selected` as selected by default', () => {
      render(
        <Select
          aria-label="Language"
          options={[
            { value: 'js', label: 'JavaScript' },
            { value: 'html', label: 'HTML', selected: true }
          ]}
        />
      )
      expect(screen.getByRole('option', { name: 'HTML' })).toHaveProperty('selected', true)
      expect(screen.getByRole('option', { name: 'JavaScript' })).toHaveProperty('selected', false)
    })

    test('passes the multiple attribute through to the native select', () => {
      render(<Select aria-label="Language" multiple options={['js', 'html']} />)
      expect(screen.getByRole('listbox', { name: 'Language' })).toHaveAttribute('multiple')
    })

    test('passes htmlSize through as the native size attribute', () => {
      render(<Select aria-label="Language" htmlSize={4} options={['js', 'html']} />)
      // A select with size > 1 maps to the listbox role (HTML-AAM), same as multiple.
      expect(screen.getByRole('listbox', { name: 'Language' })).toHaveAttribute('size', '4')
    })

    test('selects more than one option by default when multiple is set', () => {
      render(
        <Select
          aria-label="Language"
          multiple
          options={[
            { value: 'js', label: 'JavaScript', selected: true },
            { value: 'html', label: 'HTML', selected: true },
            { value: 'css', label: 'CSS' }
          ]}
        />
      )
      const select = screen.getByRole('listbox', { name: 'Language' }) as HTMLSelectElement
      expect(Array.from(select.selectedOptions).map((option) => option.value)).toEqual([
        'js',
        'html'
      ])
    })
  })

  describe('adorns', () => {
    test('renders bare without a wrapper when adornStart/adornEnd are unset', () => {
      const { container } = render(<Select aria-label="Language" options={['js']} />)
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toBe(screen.getByRole('combobox', { name: 'Language' }))
    })

    test('wraps in .form-input.form-caret with a .ghost-input select', () => {
      const { container } = render(
        <Select aria-label="Language" options={['js']} adornStart={<InputAdorn>Lang</InputAdorn>} />
      )
      const select = screen.getByRole('combobox', { name: 'Language' })
      expect(select).toHaveClass('ghost-input')
      expect(select).not.toHaveClass('form-input')
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('form-input', 'form-caret')
    })

    test('moves size and the caller className to the wrapper, not the ghost-input', () => {
      const { container } = render(
        <Select
          aria-label="Language"
          options={['js']}
          adornStart={<InputAdorn>Lang</InputAdorn>}
          className="bazinga"
          size="large"
        />
      )
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('form-input', 'large', 'bazinga')
      const select = screen.getByRole('combobox', { name: 'Language' })
      expect(select).not.toHaveClass('large', 'bazinga')
    })

    test('keeps is-invalid/is-valid on the ghost-input, not the wrapper', () => {
      const { container } = render(
        <Select
          aria-label="Language"
          options={['js']}
          adornStart={<InputAdorn>Lang</InputAdorn>}
          invalid
          valid
        />
      )
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).not.toHaveClass('is-invalid', 'is-valid')
      const select = screen.getByRole('combobox', { name: 'Language' })
      expect(select).toHaveClass('is-invalid', 'is-valid')
    })

    test('omits .form-caret and skips the proxy-open when multiple is set', () => {
      const { container } = render(
        <Select
          aria-label="Language"
          multiple
          options={['js', 'html']}
          adornStart={<InputAdorn>Lang</InputAdorn>}
        />
      )
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).not.toHaveClass('form-caret')
    })

    test('omits .form-caret and skips the proxy-open when htmlSize is greater than 1', () => {
      const { container } = render(
        <Select
          aria-label="Language"
          htmlSize={4}
          options={['js', 'html']}
          adornStart={<InputAdorn>Lang</InputAdorn>}
        />
      )
      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).not.toHaveClass('form-caret')
    })

    describe('proxy-open behavior', () => {
      let showPicker: ReturnType<typeof vi.fn>

      beforeEach(() => {
        showPicker = vi.fn()
        // jsdom doesn't implement showPicker() - stub it so the proxy-click path is observable.
        HTMLSelectElement.prototype.showPicker =
          showPicker as unknown as HTMLSelectElement['showPicker']
      })

      afterEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (HTMLSelectElement.prototype as any).showPicker
      })

      test('clicking an adorn focuses and opens the select', async () => {
        const user = userEvent.setup()
        render(
          <Select
            aria-label="Language"
            options={['js']}
            adornStart={<InputAdorn>Lang</InputAdorn>}
          />
        )
        await user.click(screen.getByText('Lang'))
        expect(screen.getByRole('combobox', { name: 'Language' })).toHaveFocus()
        expect(showPicker).toHaveBeenCalledTimes(1)
      })

      test('clicking the select itself does not double-trigger the proxy', async () => {
        const user = userEvent.setup()
        render(
          <Select
            aria-label="Language"
            options={['js']}
            adornStart={<InputAdorn>Lang</InputAdorn>}
          />
        )
        await user.click(screen.getByRole('combobox', { name: 'Language' }))
        expect(showPicker).not.toHaveBeenCalled()
      })

      test('clicking an actionable button adorn does not open the select', async () => {
        const onClick = vi.fn()
        const user = userEvent.setup()
        render(
          <Select
            aria-label="Language"
            options={['js']}
            adornEnd={
              <InputAdorn component="button" type="button" aria-label="Clear" onClick={onClick}>
                Clear
              </InputAdorn>
            }
          />
        )
        await user.click(screen.getByRole('button', { name: 'Clear' }))
        expect(onClick).toHaveBeenCalledTimes(1)
        expect(showPicker).not.toHaveBeenCalled()
      })

      test('does not open a disabled select', async () => {
        const user = userEvent.setup()
        render(
          <Select
            aria-label="Language"
            disabled
            options={['js']}
            adornStart={<InputAdorn>Lang</InputAdorn>}
          />
        )
        await user.click(screen.getByText('Lang'))
        expect(showPicker).not.toHaveBeenCalled()
      })

      test('does not open a multiple select', async () => {
        const user = userEvent.setup()
        render(
          <Select
            aria-label="Language"
            multiple
            options={['js', 'html']}
            adornStart={<InputAdorn>Lang</InputAdorn>}
          />
        )
        await user.click(screen.getByText('Lang'))
        expect(showPicker).not.toHaveBeenCalled()
      })

      test('does not open a select with htmlSize greater than 1', async () => {
        const user = userEvent.setup()
        render(
          <Select
            aria-label="Language"
            htmlSize={4}
            options={['js', 'html']}
            adornStart={<InputAdorn>Lang</InputAdorn>}
          />
        )
        await user.click(screen.getByText('Lang'))
        expect(showPicker).not.toHaveBeenCalled()
      })
    })

    test('renders both adornStart and adornEnd with the input-adorn class when set together', () => {
      render(
        <Select
          aria-label="Language"
          options={['js']}
          adornStart={<InputAdorn>Lang</InputAdorn>}
          adornEnd={<InputAdorn>Choose one</InputAdorn>}
        />
      )
      expect(screen.getByText('Lang')).toHaveClass('input-adorn')
      expect(screen.getByText('Choose one')).toHaveClass('input-adorn')
    })
  })

  describe('dev warnings', () => {
    test('warns when more than one option is selected but multiple is not set', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <Select
          aria-label="Language"
          options={[
            { value: 'js', label: 'JavaScript', selected: true },
            { value: 'html', label: 'HTML', selected: true }
          ]}
        />
      )
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('more than one option has'))
      warnSpy.mockRestore()
    })

    test('does not warn when multiple is set', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        <Select
          aria-label="Language"
          multiple
          options={[
            { value: 'js', label: 'JavaScript', selected: true },
            { value: 'html', label: 'HTML', selected: true }
          ]}
        />
      )
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })
  })

  describe('change behavior', () => {
    test('fires onChange when a new option is selected', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Select aria-label="Language" onChange={onChange} options={['js', 'html']} />)

      await user.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'html')
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('html')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying select', () => {
      const ref = React.createRef<HTMLSelectElement>()
      render(<Select ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLSelectElement)
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<Select aria-label="Language" options={['js']} />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<Select label="Language" options={['js']} />)
      const select = screen.getByRole('combobox', { name: 'Language' })
      // Same class-only wrapper as above - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(select.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Language').tagName).toBe('LABEL')
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<Select aria-label="Language" help="Some help" options={['js']} />)
      const select = screen.getByRole('combobox', { name: 'Language' })
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(select.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby, and sets aria-invalid, only when invalid', () => {
      const { rerender } = render(
        <Select aria-label="Language" invalidFeedback="Required" options={['js']} />
      )
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<Select aria-label="Language" invalid invalidFeedback="Required" options={['js']} />)
      const select = screen.getByRole('combobox', { name: 'Language' })
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(select).toHaveAttribute('aria-invalid', 'true')
      expect(select.getAttribute('aria-describedby')).toContain(feedback.id)
    })

    test('renders valid feedback only when valid is set', () => {
      render(<Select aria-label="Language" valid validFeedback="Looks good" options={['js']} />)
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Select aria-label="Language" options={['js', 'html']} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

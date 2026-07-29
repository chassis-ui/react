import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CxSelect } from '../../../index'

describe('CxSelect', () => {
  describe('rendering', () => {
    test('renders a select with the base class', () => {
      render(
        <CxSelect aria-label="Language">
          <option value="js">JavaScript</option>
        </CxSelect>
      )
      expect(screen.getByRole('combobox', { name: 'Language' })).toHaveClass('form-input')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxSelect>
          <option value="A">B</option>
          <option>C</option>
        </CxSelect>
      )
      expect(container).toMatchSnapshot()
    })

    test('applies a bare size class and className together', () => {
      render(
        <CxSelect aria-label="Language" className="bazinga" size="large">
          <option value="A">B</option>
        </CxSelect>
      )
      const select = screen.getByRole('combobox', { name: 'Language' })
      expect(select).toHaveClass('form-input', 'large', 'bazinga')
      expect(select).not.toHaveClass('form-select', 'form-select-large')
    })

    test('applies invalid/valid classes', () => {
      render(
        <CxSelect aria-label="Language" invalid>
          <option>A</option>
        </CxSelect>
      )
      expect(screen.getByRole('combobox', { name: 'Language' })).toHaveClass('is-invalid')
    })

    test('renders options from a string array', () => {
      render(<CxSelect aria-label="Language" options={['js', 'html']} />)
      expect(screen.getByRole('option', { name: 'js' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'html' })).toBeInTheDocument()
    })

    test('renders options from object definitions, including a disabled option', () => {
      render(
        <CxSelect
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

    test('renders a disabled placeholder option before the given options', () => {
      render(<CxSelect aria-label="Language" placeholder="Select a language…" options={['js']} />)
      const placeholderOption = screen.getByRole('option', { name: 'Select a language…' })
      expect(placeholderOption).toBeDisabled()
      expect(placeholderOption).toHaveValue('')
    })
  })

  describe('change behavior', () => {
    test('fires onChange when a new option is selected', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<CxSelect aria-label="Language" onChange={onChange} options={['js', 'html']} />)

      await user.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'html')
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('html')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying select', () => {
      const ref = React.createRef<HTMLSelectElement>()
      render(<CxSelect ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLSelectElement)
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<CxSelect aria-label="Language" options={['js']} />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<CxSelect label="Language" options={['js']} />)
      const select = screen.getByRole('combobox', { name: 'Language' })
      // Same class-only wrapper as above - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(select.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Language').tagName).toBe('LABEL')
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<CxSelect aria-label="Language" help="Some help" options={['js']} />)
      const select = screen.getByRole('combobox', { name: 'Language' })
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(select.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby, and sets aria-invalid, only when invalid', () => {
      const { rerender } = render(
        <CxSelect aria-label="Language" invalidFeedback="Required" options={['js']} />
      )
      expect(screen.queryByText('Required')).toBeNull()

      rerender(
        <CxSelect aria-label="Language" invalid invalidFeedback="Required" options={['js']} />
      )
      const select = screen.getByRole('combobox', { name: 'Language' })
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(select).toHaveAttribute('aria-invalid', 'true')
      expect(select.getAttribute('aria-describedby')).toContain(feedback.id)
    })

    test('renders valid feedback only when valid is set', () => {
      render(<CxSelect aria-label="Language" valid validFeedback="Looks good" options={['js']} />)
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxSelect aria-label="Language" options={['js', 'html']} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

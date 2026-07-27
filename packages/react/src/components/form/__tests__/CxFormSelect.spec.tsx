import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { CxFormSelect } from '../../../index'

describe('CxFormSelect', () => {
  describe('rendering', () => {
    test('renders a select with the base class', () => {
      render(
        <CxFormSelect aria-label="Language">
          <option value="js">JavaScript</option>
        </CxFormSelect>
      )
      expect(screen.getByRole('combobox', { name: 'Language' })).toHaveClass('form-select')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxFormSelect>
          <option value="A">B</option>
          <option>C</option>
        </CxFormSelect>
      )
      expect(container).toMatchSnapshot()
    })

    test('applies size class and className together', () => {
      render(
        <CxFormSelect aria-label="Language" className="bazinga" size="large">
          <option value="A">B</option>
        </CxFormSelect>
      )
      expect(screen.getByRole('combobox', { name: 'Language' })).toHaveClass(
        'form-select',
        'form-select-large',
        'bazinga'
      )
    })

    test('applies invalid/valid classes', () => {
      render(
        <CxFormSelect aria-label="Language" invalid>
          <option>A</option>
        </CxFormSelect>
      )
      expect(screen.getByRole('combobox', { name: 'Language' })).toHaveClass('is-invalid')
    })

    test('renders options from a string array', () => {
      render(<CxFormSelect aria-label="Language" options={['js', 'html']} />)
      expect(screen.getByRole('option', { name: 'js' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'html' })).toBeInTheDocument()
    })

    test('renders options from object definitions, including a disabled option', () => {
      render(
        <CxFormSelect
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
      render(
        <CxFormSelect aria-label="Language" placeholder="Select a language…" options={['js']} />
      )
      const placeholderOption = screen.getByRole('option', { name: 'Select a language…' })
      expect(placeholderOption).toBeDisabled()
      expect(placeholderOption).toHaveValue('')
    })
  })

  describe('change behavior', () => {
    test('fires onChange when a new option is selected', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<CxFormSelect aria-label="Language" onChange={onChange} options={['js', 'html']} />)

      await user.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'html')
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('html')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying select', () => {
      const ref = React.createRef<HTMLSelectElement>()
      render(<CxFormSelect ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLSelectElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxFormSelect aria-label="Language" options={['js', 'html']} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxFileInput } from '../../../index'

describe('CxFileInput', () => {
  describe('rendering', () => {
    test('renders a file input with the base class', () => {
      render(<CxFileInput aria-label="Attachment" />)
      expect(screen.getByLabelText('Attachment')).toHaveClass('form-input')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxFileInput />)
      expect(container).toMatchSnapshot()
    })

    test('applies size, invalid/valid classes and multiple/disabled attributes', () => {
      // No label given here (deliberately, to test the bare attribute/class output), so the
      // input has no accessible name and no query reaches it.
      const { container } = render(
        <CxFileInput className="bazinga" disabled invalid multiple size="large" valid />
      )
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const input = container.querySelector('input[type="file"]')
      expect(input).toHaveClass('form-input', 'large', 'is-invalid', 'is-valid', 'bazinga')
      expect(input).toBeDisabled()
      expect(input).toHaveAttribute('multiple')
    })
  })

  describe('change behavior', () => {
    test('fires onChange when a file is selected', () => {
      const onChange = vi.fn()
      render(<CxFileInput aria-label="Attachment" onChange={onChange} />)
      const input = screen.getByLabelText('Attachment')

      fireEvent.change(input)
      expect(onChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<CxFileInput ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<CxFileInput aria-label="Attachment" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<CxFileInput label="Attachment" />)
      const input = screen.getByLabelText('Attachment')
      // Same class-only wrapper as above - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Attachment').tagName).toBe('LABEL')
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<CxFileInput aria-label="Attachment" help="Some help" />)
      const input = screen.getByLabelText('Attachment')
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(input.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby, and sets aria-invalid, only when invalid', () => {
      const { rerender } = render(
        <CxFileInput aria-label="Attachment" invalidFeedback="Required" />
      )
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<CxFileInput aria-label="Attachment" invalid invalidFeedback="Required" />)
      const input = screen.getByLabelText('Attachment')
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input.getAttribute('aria-describedby')).toContain(feedback.id)
    })

    test('renders valid feedback only when valid is set', () => {
      render(<CxFileInput aria-label="Attachment" valid validFeedback="Looks good" />)
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxFileInput aria-label="Attachment" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

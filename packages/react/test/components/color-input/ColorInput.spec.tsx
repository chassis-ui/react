import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ColorInput } from '../../../src/index'

describe('ColorInput', () => {
  describe('rendering', () => {
    test('renders a color input with the base class', () => {
      render(<ColorInput aria-label="Accent color" />)
      const input = screen.getByLabelText('Accent color')
      expect(input).toHaveClass('form-input')
      expect(input).toHaveAttribute('type', 'color')
    })

    test('defaultValue seeds the initial value attribute', () => {
      const { container } = render(<ColorInput defaultValue="#ff0000" />)
      // No accessible name is set on this render - same unlabeled-input case as the snapshot it
      // replaces, so the only way to reach the input is via the container.
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('input')).toHaveAttribute('value', '#ff0000')
    })

    test('applies size, invalid/valid classes and disabled attribute', () => {
      render(
        <ColorInput
          aria-label="Accent color"
          className="bazinga"
          disabled
          invalid
          size="large"
          valid
        />
      )
      const input = screen.getByLabelText('Accent color')
      expect(input).toHaveClass('form-input', 'large', 'is-invalid', 'is-valid', 'bazinga')
      expect(input).toBeDisabled()
    })
  })

  describe('change behavior', () => {
    test('fires onChange while typing (uncontrolled)', () => {
      const onChange = vi.fn()
      render(<ColorInput aria-label="Accent color" onChange={onChange} />)
      const input = screen.getByLabelText('Accent color')

      fireEvent.change(input, { target: { value: '#00ff00' } })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(input).toHaveValue('#00ff00')
    })

    test('reflects a controlled value and does not update without a matching value prop', () => {
      const onChange = vi.fn()
      render(<ColorInput aria-label="Accent color" value="#0000ff" onChange={onChange} />)
      const input = screen.getByLabelText('Accent color')

      fireEvent.change(input, { target: { value: '#00ff00' } })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(input).toHaveValue('#0000ff')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<ColorInput ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<ColorInput aria-label="Accent color" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<ColorInput label="Accent color" />)
      const input = screen.getByLabelText('Accent color')
      // Same class-only wrapper as above - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Accent color').tagName).toBe('LABEL')
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<ColorInput aria-label="Accent color" help="Some help" />)
      const input = screen.getByLabelText('Accent color')
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(input.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby, and sets aria-invalid, only when invalid', () => {
      const { rerender } = render(
        <ColorInput aria-label="Accent color" invalidFeedback="Required" />
      )
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<ColorInput aria-label="Accent color" invalid invalidFeedback="Required" />)
      const input = screen.getByLabelText('Accent color')
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input.getAttribute('aria-describedby')).toContain(feedback.id)
    })

    test('renders valid feedback only when valid is set', () => {
      render(<ColorInput aria-label="Accent color" valid validFeedback="Looks good" />)
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<ColorInput aria-label="Accent color" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

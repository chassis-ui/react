import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { RangeInput } from '../../../src/index'

describe('RangeInput', () => {
  describe('rendering', () => {
    test('renders a range input with the base class', () => {
      render(<RangeInput aria-label="Volume" step={3} />)
      const range = screen.getByRole('slider', { name: 'Volume' })
      expect(range).toHaveClass('form-range')
      expect(range).toHaveAttribute('type', 'range')
      expect(range).toHaveAttribute('step', '3')
    })

    test('applies min, max, value, disabled and readOnly attributes', () => {
      render(
        <RangeInput
          aria-label="Volume"
          className="bazinga"
          step={2}
          disabled={true}
          max={150}
          min={20}
          readOnly={true}
          value={80}
        />
      )
      const range = screen.getByRole('slider', { name: 'Volume' })
      expect(range).toHaveClass('form-range', 'bazinga')
      expect(range).toHaveAttribute('max', '150')
      expect(range).toHaveAttribute('min', '20')
      expect(range).toHaveAttribute('readonly')
      expect(range).toHaveAttribute('step', '2')
      expect(range).toHaveValue('80')
      expect(range).toBeDisabled()
    })

    test('applies is-invalid/is-valid classes', () => {
      render(<RangeInput aria-label="Volume" invalid valid />)
      const range = screen.getByRole('slider', { name: 'Volume' })
      expect(range).toHaveClass('form-range', 'is-invalid', 'is-valid')
    })
  })

  describe('change behavior', () => {
    test('fires onChange when the value changes', () => {
      const onChange = vi.fn()
      render(<RangeInput aria-label="Volume" onChange={onChange} />)
      const range = screen.getByRole('slider', { name: 'Volume' })

      fireEvent.change(range, { target: { value: '42' } })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(range).toHaveValue('42')
    })

    test('reflects a controlled value and does not update without a matching value prop', () => {
      const onChange = vi.fn()
      render(<RangeInput aria-label="Volume" value={50} onChange={onChange} />)
      const range = screen.getByRole('slider', { name: 'Volume' })

      fireEvent.change(range, { target: { value: '90' } })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(range).toHaveValue('50')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<RangeInput ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<RangeInput aria-label="Volume" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<RangeInput label="Volume" />)
      const range = screen.getByRole('slider', { name: 'Volume' })
      // Same class-only wrapper as above - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(range.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Volume').tagName).toBe('LABEL')
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<RangeInput aria-label="Volume" help="Some help" />)
      const range = screen.getByRole('slider', { name: 'Volume' })
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(range.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby, and sets aria-invalid, only when invalid', () => {
      const { rerender } = render(<RangeInput aria-label="Volume" invalidFeedback="Required" />)
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<RangeInput aria-label="Volume" invalid invalidFeedback="Required" />)
      const range = screen.getByRole('slider', { name: 'Volume' })
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(range).toHaveAttribute('aria-invalid', 'true')
      expect(range.getAttribute('aria-describedby')).toContain(feedback.id)
    })

    test('renders valid feedback only when valid is set', () => {
      render(<RangeInput aria-label="Volume" valid validFeedback="Looks good" />)
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<RangeInput aria-label="Volume" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations in a realistic composed state (label, help, invalidFeedback)', async () => {
      const { container } = render(
        <RangeInput
          label="Volume"
          help="Adjust the playback volume"
          invalid
          invalidFeedback="Required"
          value={50}
        />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxFormRange } from '../../../index'

describe('CxFormRange', () => {
  describe('rendering', () => {
    test('renders a range input with the base class', () => {
      render(<CxFormRange aria-label="Volume" step={3} />)
      const range = screen.getByRole('slider', { name: 'Volume' })
      expect(range).toHaveClass('form-range')
      expect(range).toHaveAttribute('type', 'range')
      expect(range).toHaveAttribute('step', '3')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxFormRange step={3} />)
      expect(container).toMatchSnapshot()
    })

    test('applies min, max, value, disabled and readOnly attributes', () => {
      render(
        <CxFormRange
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
  })

  describe('change behavior', () => {
    test('fires onChange when the value changes', () => {
      const onChange = vi.fn()
      render(<CxFormRange aria-label="Volume" onChange={onChange} />)
      const range = screen.getByRole('slider', { name: 'Volume' })

      fireEvent.change(range, { target: { value: '42' } })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(range).toHaveValue('42')
    })

    test('reflects a controlled value and does not update without a matching value prop', () => {
      const onChange = vi.fn()
      render(<CxFormRange aria-label="Volume" value={50} onChange={onChange} />)
      const range = screen.getByRole('slider', { name: 'Volume' })

      fireEvent.change(range, { target: { value: '90' } })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(range).toHaveValue('50')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<CxFormRange ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxFormRange aria-label="Volume" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

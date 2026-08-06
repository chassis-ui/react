import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Switch } from '../../../src/index'

describe('Switch', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Switch aria-label="Notifications" />)
      expect(container).toMatchSnapshot()
    })

    test('renders role="switch" for the checkbox-backed default type', () => {
      render(<Switch aria-label="Notifications" />)
      expect(screen.getByRole('switch')).toBeInTheDocument()
    })
  })

  describe('styling props', () => {
    test('applies color, size, invalid/valid classes together, as a radio-backed switch', () => {
      const { container } = render(
        <Switch
          className="bazinga"
          color="secondary"
          id="2"
          invalid={true}
          label="Some label"
          size="large"
          type="radio"
          valid={true}
        />
      )
      expect(container).toMatchSnapshot()

      const input = screen.getByRole('switch', { name: 'Some label' })
      expect(input).toHaveAttribute('id', '2')
      expect(input).toHaveAttribute('type', 'radio')
      expect(input).toHaveClass('is-invalid', 'is-valid')

      // The check-input span and outer label wrapper are plain elements with no distinct
      // role of their own - the switch input is the only accessible entry point to reach them.
      // eslint-disable-next-line testing-library/no-node-access
      const checkInput = input.parentElement
      expect(checkInput).toHaveClass('check-input', 'secondary', 'is-invalid', 'is-valid')

      // eslint-disable-next-line testing-library/no-node-access
      const wrapper = input.closest('label')
      expect(wrapper).toHaveClass(
        'form-check',
        'form-switch',
        'large',
        'is-invalid',
        'is-valid',
        'bazinga'
      )
      expect(wrapper).toHaveTextContent('Some label')
    })
  })

  describe('selection behavior', () => {
    test('an uncontrolled switch toggles on click and fires onChange(isSelected)', () => {
      const onChange = vi.fn()
      render(<Switch aria-label="Notifications" defaultSelected={false} onChange={onChange} />)
      const input = screen.getByRole('switch')
      expect(input).not.toBeChecked()
      fireEvent.click(input)
      expect(input).toBeChecked()
      expect(onChange).toHaveBeenCalledWith(true)
    })

    test('a controlled switch reflects isSelected and fires onChange(isSelected) without changing itself', () => {
      const onChange = vi.fn()
      render(<Switch aria-label="Notifications" isSelected={false} onChange={onChange} />)
      const input = screen.getByRole('switch')
      fireEvent.click(input)
      expect(onChange).toHaveBeenCalledWith(true)
      expect(input).not.toBeChecked()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Switch ref={ref} aria-label="Notifications" />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Switch label="Notifications" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

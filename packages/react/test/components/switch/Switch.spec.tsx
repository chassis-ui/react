import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Switch } from '../../../src/index'

describe('Switch', () => {
  describe('rendering', () => {
    test('renders role="switch" for the checkbox-backed default type', () => {
      render(<Switch aria-label="Notifications" />)
      expect(screen.getByRole('switch')).toBeInTheDocument()
    })

    test('renders a bare check-input span, not an empty label wrapper, when unlabeled', () => {
      render(<Switch aria-label="Notifications" />)
      const input = screen.getByRole('switch')
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.parentElement).toHaveClass('check-input')
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.closest('label')).toBeNull()
      expect(input).toHaveAttribute('type', 'checkbox')
      expect(input).toHaveAttribute('data-react-aria-pressable', 'true')
      expect(input).toHaveAttribute('tabindex', '0')
    })
  })

  describe('styling props', () => {
    test('applies color, size, invalid/valid classes together, as a radio-backed switch', () => {
      render(
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

  describe('validation state', () => {
    test('sets aria-invalid on the checkbox-backed switch when invalid', () => {
      render(<Switch aria-label="Notifications" invalid />)
      expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true')
    })

    test('does not set aria-invalid when not invalid', () => {
      render(<Switch aria-label="Notifications" />)
      expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid')
    })

    test('sets aria-invalid on the radio-backed switch when invalid', () => {
      render(<Switch aria-label="Notifications" type="radio" invalid />)
      expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true')
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

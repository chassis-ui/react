import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Radio, RadioGroup } from '../../../src/index'

describe('Radio', () => {
  describe('rendering', () => {
    test('wraps each option in a labelled fieldset with the roving tabindex/pressable wiring', () => {
      render(
        <RadioGroup aria-label="Options" defaultValue="a">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      )
      const fieldset = screen.getByRole('radiogroup', { name: 'Options' })
      expect(fieldset).toHaveClass('form-field')
      expect(fieldset).toHaveAttribute('aria-orientation', 'vertical')

      const a = screen.getByRole('radio', { name: 'Option A' })
      const b = screen.getByRole('radio', { name: 'Option B' })
      // The label wrapping each option is a plain element with no role/name of its own.
      // eslint-disable-next-line testing-library/no-node-access
      expect(a.closest('label')).toHaveClass('form-check')
      expect(a).toHaveAttribute('data-react-aria-pressable', 'true')
      expect(a).toHaveAttribute('tabindex', '0')
      expect(b).toHaveAttribute('tabindex', '-1')
    })

    test('throws when rendered outside a RadioGroup', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      // React's dev-mode guarded-callback replay dispatches this render error as a
      // real DOM "error" event so jsdom can report it; suppress it here since the
      // throw is expected and already asserted below.
      const onWindowError = (event: ErrorEvent) => event.preventDefault()
      window.addEventListener('error', onWindowError)

      expect(() => render(<Radio value="a" label="Option A" />)).toThrow(
        'Radio must be rendered inside a RadioGroup.'
      )

      window.removeEventListener('error', onWindowError)
      consoleError.mockRestore()
    })
  })

  describe('styling props', () => {
    test('applies color and className to the check wrapper', () => {
      render(
        <RadioGroup aria-label="Options" defaultValue="a">
          <Radio className="bazinga" color="secondary" id="id" label="label" value="a" />
        </RadioGroup>
      )
      const radio = screen.getByRole('radio')
      expect(radio).toHaveAttribute('id', 'id')
      // The check wrapper is a plain div with no role/name - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      const checkInput = radio.parentElement
      expect(checkInput).toHaveClass('check-input')
      expect(checkInput).toHaveClass('secondary')
      // eslint-disable-next-line testing-library/no-node-access
      expect(checkInput?.parentElement).toHaveClass('bazinga')
    })

    test('renders the button variant classes on the check wrapper', () => {
      render(
        <RadioGroup aria-label="Options" defaultValue="a">
          <Radio
            button={{ color: 'primary', size: 'large', shape: 'rounded', variant: 'ghost' }}
            label="label"
            value="a"
          />
        </RadioGroup>
      )
      const radio = screen.getByRole('radio')
      // Same unlabeled check wrapper as above.
      // eslint-disable-next-line testing-library/no-node-access
      expect(radio.parentElement).toHaveClass('button')
      // eslint-disable-next-line testing-library/no-node-access
      expect(radio.parentElement).toHaveClass('button-check')
      // eslint-disable-next-line testing-library/no-node-access
      expect(radio.parentElement).toHaveClass('primary')
    })
  })

  describe('selection behavior', () => {
    test('an uncontrolled radio group toggles selection on click and fires onChange(value)', () => {
      const onChange = vi.fn()
      render(
        <RadioGroup aria-label="Options" defaultValue="a" onChange={onChange}>
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      )
      const a = screen.getByRole('radio', { name: 'Option A' })
      const b = screen.getByRole('radio', { name: 'Option B' })
      expect(a).toBeChecked()
      expect(b).not.toBeChecked()

      fireEvent.click(b)
      expect(onChange).toHaveBeenCalledWith('b')
      expect(b).toBeChecked()
      expect(a).not.toBeChecked()
    })

    test('a controlled radio group reflects value and fires onChange(value) without changing itself', () => {
      const onChange = vi.fn()
      render(
        <RadioGroup aria-label="Options" value="a" onChange={onChange}>
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      )
      const b = screen.getByRole('radio', { name: 'Option B' })
      fireEvent.click(b)
      expect(onChange).toHaveBeenCalledWith('b')
      // Still unchecked — the consumer owns the state and hasn't re-rendered with value="b".
      expect(b).not.toBeChecked()
    })

    test('disabling a single radio only disables that option', () => {
      render(
        <RadioGroup aria-label="Options" defaultValue="a">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" disabled />
        </RadioGroup>
      )
      expect(screen.getByRole('radio', { name: 'Option A' })).toBeEnabled()
      expect(screen.getByRole('radio', { name: 'Option B' })).toBeDisabled()
    })

    test('disabling the group disables every radio', () => {
      render(
        <RadioGroup aria-label="Options" defaultValue="a" disabled>
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      )
      expect(screen.getByRole('radio', { name: 'Option A' })).toBeDisabled()
      expect(screen.getByRole('radio', { name: 'Option B' })).toBeDisabled()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying input', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(
        <RadioGroup aria-label="Options" defaultValue="a">
          <Radio ref={ref} value="a" label="Option A" />
        </RadioGroup>
      )
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <RadioGroup aria-label="Options" defaultValue="a">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

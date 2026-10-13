import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { InputAdorn } from '../../../src/index'

describe('InputAdorn', () => {
  describe('rendering', () => {
    test('renders a span with the base class by default', () => {
      render(<InputAdorn>Test</InputAdorn>)
      const adorn = screen.getByText('Test')
      expect(adorn).toHaveClass('input-adorn')
      expect(adorn.tagName).toBe('SPAN')
    })

    test('renders as a custom component with className merged', () => {
      render(
        <InputAdorn className="bazinga" component="button" type="button" aria-label="Clear">
          Test
        </InputAdorn>
      )
      const adorn = screen.getByRole('button', { name: 'Clear' })
      expect(adorn).toHaveClass('input-adorn', 'bazinga')
      expect(adorn.tagName).toBe('BUTTON')
    })
  })

  // A `<button>` with no `type` submits: a password reveal adorn submitted the form around it.
  describe('button type', () => {
    const setupInForm = (adorn: React.ReactElement) => {
      const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
      render(
        <form aria-label="Sign in" onSubmit={onSubmit}>
          <input aria-label="Password" type="password" />
          {adorn}
        </form>
      )
      return onSubmit
    }

    test('a button adorn is type="button" by default and does not submit its form', () => {
      const onSubmit = setupInForm(
        <InputAdorn aria-label="Show password" component="button">
          Show
        </InputAdorn>
      )
      const adorn = screen.getByRole('button', { name: 'Show password' })
      expect(adorn).toHaveAttribute('type', 'button')
      fireEvent.click(adorn)
      expect(onSubmit).not.toHaveBeenCalled()
    })

    test('a slotted button gets the same default', () => {
      const onSubmit = setupInForm(
        <InputAdorn asChild>
          <button aria-label="Show password">Show</button>
        </InputAdorn>
      )
      const adorn = screen.getByRole('button', { name: 'Show password' })
      expect(adorn).toHaveAttribute('type', 'button')
      fireEvent.click(adorn)
      expect(onSubmit).not.toHaveBeenCalled()
    })

    test('keeps a type the caller gives', () => {
      const onSubmit = setupInForm(
        <InputAdorn aria-label="Sign in" component="button" type="submit">
          Go
        </InputAdorn>
      )
      const adorn = screen.getByRole('button', { name: 'Sign in' })
      expect(adorn).toHaveAttribute('type', 'submit')
      fireEvent.click(adorn)
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    test('leaves type off an element that is not a button', () => {
      render(<InputAdorn>kg</InputAdorn>)
      expect(screen.getByText('kg')).not.toHaveAttribute('type')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<InputAdorn ref={ref}>Test</InputAdorn>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('focus retention', () => {
    test('prevents default on mousedown to keep focus on an associated input', () => {
      render(
        <InputAdorn component="button" type="button" aria-label="Toggle">
          Test
        </InputAdorn>
      )
      const adorn = screen.getByRole('button', { name: 'Toggle' })
      const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
      const dispatchResult = adorn.dispatchEvent(event)
      expect(dispatchResult).toBe(false)
      expect(event.defaultPrevented).toBe(true)
    })

    test('still invokes a consumer-provided onMouseDown handler', () => {
      const handleMouseDown = vi.fn()
      render(
        <InputAdorn
          component="button"
          type="button"
          aria-label="Toggle"
          onMouseDown={handleMouseDown}
        >
          Test
        </InputAdorn>
      )
      const adorn = screen.getByRole('button', { name: 'Toggle' })
      adorn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))
      expect(handleMouseDown).toHaveBeenCalledTimes(1)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<InputAdorn>Test</InputAdorn>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

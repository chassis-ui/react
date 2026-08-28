import * as React from 'react'
import { render, screen } from '@testing-library/react'
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

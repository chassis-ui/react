import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { InputGroupAddon } from '../../../src/index'

describe('InputGroupAddon', () => {
  describe('rendering', () => {
    test('renders a span with the base class by default', () => {
      render(<InputGroupAddon>Test</InputGroupAddon>)
      const addon = screen.getByText('Test')
      expect(addon).toHaveClass('input-addon')
      expect(addon.tagName).toBe('SPAN')
    })

    test('renders as a custom component with className merged', () => {
      render(
        <InputGroupAddon className="bazinga" component="label">
          Test
        </InputGroupAddon>
      )
      const addon = screen.getByText('Test')
      expect(addon).toHaveClass('input-addon', 'bazinga')
      expect(addon.tagName).toBe('LABEL')
    })

    test('renders htmlFor as the for attribute when rendered as a label', () => {
      render(
        <InputGroupAddon component="label" htmlFor="username">
          Username
        </InputGroupAddon>
      )
      expect(screen.getByText('Username')).toHaveAttribute('for', 'username')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<InputGroupAddon ref={ref}>Test</InputGroupAddon>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<InputGroupAddon>Test</InputGroupAddon>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

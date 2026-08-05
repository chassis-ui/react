import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { InputGroup } from '../../../index'

describe('InputGroup.Addon', () => {
  describe('rendering', () => {
    test('renders a span with the base class by default', () => {
      render(<InputGroup.Addon>Test</InputGroup.Addon>)
      const addon = screen.getByText('Test')
      expect(addon).toHaveClass('input-addon')
      expect(addon.tagName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<InputGroup.Addon>Test</InputGroup.Addon>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <InputGroup.Addon className="bazinga" component="label">
          Test
        </InputGroup.Addon>
      )
      const addon = screen.getByText('Test')
      expect(addon).toHaveClass('input-addon', 'bazinga')
      expect(addon.tagName).toBe('LABEL')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<InputGroup.Addon ref={ref}>Test</InputGroup.Addon>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<InputGroup.Addon>Test</InputGroup.Addon>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { FormHelp } from '../../../src/index'

describe('FormHelp', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      render(<FormHelp>Test</FormHelp>)
      const help = screen.getByText('Test')
      expect(help).toHaveClass('form-help')
      expect(help.tagName).toBe('DIV')
    })

    test('renders as a custom component with className merged', () => {
      render(
        <FormHelp className="bazinga" component="h3">
          Test
        </FormHelp>
      )
      const help = screen.getByText('Test')
      expect(help).toHaveClass('form-help', 'bazinga')
      expect(help.tagName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<FormHelp ref={ref}>Test</FormHelp>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<FormHelp>Test</FormHelp>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

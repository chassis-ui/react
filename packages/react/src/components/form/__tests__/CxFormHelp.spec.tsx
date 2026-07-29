import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxFormHelp } from '../../../index'

describe('CxFormHelp', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      render(<CxFormHelp>Test</CxFormHelp>)
      const help = screen.getByText('Test')
      expect(help).toHaveClass('form-help')
      expect(help.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxFormHelp>Test</CxFormHelp>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CxFormHelp className="bazinga" component="h3">
          Test
        </CxFormHelp>
      )
      const help = screen.getByText('Test')
      expect(help).toHaveClass('form-help', 'bazinga')
      expect(help.tagName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxFormHelp ref={ref}>Test</CxFormHelp>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxFormHelp>Test</CxFormHelp>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

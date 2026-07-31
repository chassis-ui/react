import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxInputHelp } from '../../../index'

describe('CxInputHelp', () => {
  describe('rendering', () => {
    test('renders a span with the base class by default', () => {
      render(<CxInputHelp>Test</CxInputHelp>)
      const help = screen.getByText('Test')
      expect(help).toHaveClass('input-help')
      expect(help.tagName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxInputHelp>Test</CxInputHelp>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CxInputHelp className="bazinga" component="button" type="button" aria-label="Clear">
          Test
        </CxInputHelp>
      )
      const help = screen.getByRole('button', { name: 'Clear' })
      expect(help).toHaveClass('input-help', 'bazinga')
      expect(help.tagName).toBe('BUTTON')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<CxInputHelp ref={ref}>Test</CxInputHelp>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxInputHelp>Test</CxInputHelp>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

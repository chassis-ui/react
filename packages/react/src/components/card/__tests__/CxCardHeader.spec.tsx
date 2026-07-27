import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCardHeader } from '../../../index'

describe('CxCardHeader', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      const { container } = render(<CxCardHeader>Test</CxCardHeader>)
      expect(container.firstChild).toHaveClass('card-header')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCardHeader>Test</CxCardHeader>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      const { container } = render(
        <CxCardHeader className="bazinga" component="h3">
          Test
        </CxCardHeader>
      )
      expect(container.firstChild).toHaveClass('card-header', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxCardHeader ref={ref}>Test</CxCardHeader>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCardHeader>Test</CxCardHeader>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

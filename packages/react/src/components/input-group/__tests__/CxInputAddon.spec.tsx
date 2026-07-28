import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxInputAddon } from '../../../index'

describe('CxInputAddon', () => {
  describe('rendering', () => {
    test('renders a span with the base class by default', () => {
      const { container } = render(<CxInputAddon>Test</CxInputAddon>)
      expect(container.firstChild).toHaveClass('input-addon')
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxInputAddon>Test</CxInputAddon>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      const { container } = render(
        <CxInputAddon className="bazinga" component="label">
          Test
        </CxInputAddon>
      )
      expect(container.firstChild).toHaveClass('input-addon', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('LABEL')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<CxInputAddon ref={ref}>Test</CxInputAddon>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxInputAddon>Test</CxInputAddon>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

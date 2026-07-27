import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCardFooter } from '../../../index'

describe('CxCardFooter', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      const { container } = render(<CxCardFooter className="bazinga">Test</CxCardFooter>)
      expect(container.firstChild).toHaveClass('card-footer', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCardFooter>Test</CxCardFooter>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxCardFooter ref={ref}>Test</CxCardFooter>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCardFooter>Test</CxCardFooter>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

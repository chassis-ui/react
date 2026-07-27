import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxToastFooter } from '../../../index'

describe('CxToastFooter', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      const { container } = render(<CxToastFooter className="bazinga">Test</CxToastFooter>)
      expect(container.firstChild).toHaveClass('toast-footer', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxToastFooter>Test</CxToastFooter>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxToastFooter ref={ref}>Test</CxToastFooter>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxToastFooter>Test</CxToastFooter>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

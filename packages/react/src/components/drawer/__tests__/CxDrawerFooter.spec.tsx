import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxDrawerFooter } from '../../../index'

describe('CxDrawerFooter', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      const { container } = render(<CxDrawerFooter className="bazinga">Test</CxDrawerFooter>)
      expect(container.firstChild).toHaveClass('drawer-footer', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxDrawerFooter>Test</CxDrawerFooter>)
      expect(container).toMatchSnapshot()
    })

    test('applies the stacked class', () => {
      const { container } = render(<CxDrawerFooter stacked>Test</CxDrawerFooter>)
      expect(container.firstChild).toHaveClass('drawer-footer', 'stacked')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxDrawerFooter ref={ref}>Test</CxDrawerFooter>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxDrawerFooter>Test</CxDrawerFooter>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxTabContent } from '../../../index'

describe('CxTabContent', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      const { container } = render(<CxTabContent className="bazinga">Test</CxTabContent>)
      expect(container.firstChild).toHaveClass('tab-content', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxTabContent>Test</CxTabContent>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxTabContent ref={ref}>Test</CxTabContent>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxTabContent>Test</CxTabContent>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

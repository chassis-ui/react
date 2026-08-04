import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { TabContent } from '../../../index'

describe('TabContent', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<TabContent className="bazinga">Test</TabContent>)
      const content = screen.getByText('Test')
      expect(content).toHaveClass('tab-content', 'bazinga')
      expect(content.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<TabContent>Test</TabContent>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<TabContent ref={ref}>Test</TabContent>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<TabContent>Test</TabContent>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

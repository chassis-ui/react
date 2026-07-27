import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxMenuText } from '../../../index'

describe('CxMenuText', () => {
  describe('rendering', () => {
    test('renders a span with the base class by default', () => {
      render(<CxMenuText>Test</CxMenuText>)
      const text = screen.getByText('Test')
      expect(text).toHaveClass('menu-text')
      expect(text.tagName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxMenuText>Test</CxMenuText>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CxMenuText component="p" className="bazinga">
          Test
        </CxMenuText>
      )
      const text = screen.getByText('Test')
      expect(text).toHaveClass('menu-text', 'bazinga')
      expect(text.tagName).toBe('P')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<CxMenuText ref={ref}>Test</CxMenuText>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxMenuText>Test</CxMenuText>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

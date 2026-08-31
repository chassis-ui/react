import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { MenuText } from '../../../src/index'

describe('MenuText', () => {
  describe('rendering', () => {
    test('renders a span with the base class by default', () => {
      render(<MenuText>Test</MenuText>)
      const text = screen.getByText('Test')
      expect(text).toHaveClass('menu-text')
      expect(text.tagName).toBe('SPAN')
    })

    test('renders as a custom component with className merged', () => {
      render(
        <MenuText component="p" className="bazinga">
          Test
        </MenuText>
      )
      const text = screen.getByText('Test')
      expect(text).toHaveClass('menu-text', 'bazinga')
      expect(text.tagName).toBe('P')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<MenuText ref={ref}>Test</MenuText>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<MenuText>Test</MenuText>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

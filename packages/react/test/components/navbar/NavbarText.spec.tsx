import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { NavbarText } from '../../../src/index'

describe('NavbarText', () => {
  describe('rendering', () => {
    test('renders a span with the base class and className merged', () => {
      render(<NavbarText className="bazinga">Test</NavbarText>)
      const text = screen.getByText('Test')
      expect(text).toHaveClass('navbar-text', 'bazinga')
      expect(text.tagName).toBe('SPAN')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<NavbarText ref={ref}>Test</NavbarText>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<NavbarText>Test</NavbarText>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

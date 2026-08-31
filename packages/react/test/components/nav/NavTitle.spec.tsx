import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { NavTitle } from '../../../src/index'

describe('NavTitle', () => {
  describe('rendering', () => {
    test('renders a li with the base class and className merged', () => {
      render(<NavTitle className="bazinga">Test</NavTitle>)
      const title = screen.getByText('Test')
      expect(title).toHaveClass('nav-title', 'bazinga')
      expect(title.tagName).toBe('LI')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying li', () => {
      const ref = React.createRef<HTMLLIElement>()
      render(<NavTitle ref={ref}>Test</NavTitle>)
      expect(ref.current).toBeInstanceOf(HTMLLIElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ul>
          <NavTitle>Test</NavTitle>
        </ul>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

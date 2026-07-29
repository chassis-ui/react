import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxNavTitle } from '../../../index'

describe('CxNavTitle', () => {
  describe('rendering', () => {
    test('renders a li with the base class and className merged', () => {
      render(<CxNavTitle className="bazinga">Test</CxNavTitle>)
      const title = screen.getByText('Test')
      expect(title).toHaveClass('nav-title', 'bazinga')
      expect(title.tagName).toBe('LI')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxNavTitle>Test</CxNavTitle>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying li', () => {
      const ref = React.createRef<HTMLLIElement>()
      render(<CxNavTitle ref={ref}>Test</CxNavTitle>)
      expect(ref.current).toBeInstanceOf(HTMLLIElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ul>
          <CxNavTitle>Test</CxNavTitle>
        </ul>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

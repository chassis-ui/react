import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxDrawerTitle } from '../../../index'

describe('CxDrawerTitle', () => {
  describe('rendering', () => {
    test('renders an h2 with the base class by default', () => {
      render(<CxDrawerTitle>Test</CxDrawerTitle>)
      const heading = screen.getByRole('heading', { level: 2, name: 'Test' })
      expect(heading).toHaveClass('drawer-title')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxDrawerTitle>Test</CxDrawerTitle>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CxDrawerTitle className="bazinga" component="h3">
          Test
        </CxDrawerTitle>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('drawer-title', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<CxDrawerTitle ref={ref}>Test</CxDrawerTitle>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxDrawerTitle>Test</CxDrawerTitle>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

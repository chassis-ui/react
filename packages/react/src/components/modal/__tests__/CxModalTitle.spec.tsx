import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxModalTitle } from '../../../index'

describe('CxModalTitle', () => {
  describe('rendering', () => {
    test('renders an h2 with the base class by default', () => {
      render(<CxModalTitle>Test</CxModalTitle>)
      const heading = screen.getByRole('heading', { level: 2, name: 'Test' })
      expect(heading).toHaveClass('modal-title')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxModalTitle>Test</CxModalTitle>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CxModalTitle className="bazinga" component="h3">
          Test
        </CxModalTitle>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('modal-title', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<CxModalTitle ref={ref}>Test</CxModalTitle>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxModalTitle>Test</CxModalTitle>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

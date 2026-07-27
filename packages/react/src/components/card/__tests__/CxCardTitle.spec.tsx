import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCardTitle } from '../../../index'

describe('CxCardTitle', () => {
  describe('rendering', () => {
    test('renders an h5 with the base class by default', () => {
      render(<CxCardTitle>Test</CxCardTitle>)
      const heading = screen.getByRole('heading', { level: 5, name: 'Test' })
      expect(heading).toHaveClass('card-title')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCardTitle>Test</CxCardTitle>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CxCardTitle className="bazinga" component="h3">
          Test
        </CxCardTitle>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('card-title', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<CxCardTitle ref={ref}>Test</CxCardTitle>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCardTitle>Test</CxCardTitle>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

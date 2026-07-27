import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCardSubtitle } from '../../../index'

describe('CxCardSubtitle', () => {
  describe('rendering', () => {
    test('renders an h6 with the base class by default', () => {
      render(<CxCardSubtitle>Test</CxCardSubtitle>)
      const heading = screen.getByRole('heading', { level: 6, name: 'Test' })
      expect(heading).toHaveClass('card-subtitle')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCardSubtitle>Test</CxCardSubtitle>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CxCardSubtitle className="bazinga" component="h3">
          Test
        </CxCardSubtitle>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('card-subtitle', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<CxCardSubtitle ref={ref}>Test</CxCardSubtitle>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCardSubtitle>Test</CxCardSubtitle>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

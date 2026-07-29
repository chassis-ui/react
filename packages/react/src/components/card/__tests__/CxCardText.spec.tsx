import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCardText } from '../../../index'

describe('CxCardText', () => {
  describe('rendering', () => {
    test('renders a p with the base class by default', () => {
      render(<CxCardText>Test</CxCardText>)
      const text = screen.getByText('Test')
      expect(text).toHaveClass('card-text')
      expect(text.tagName).toBe('P')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCardText>Test</CxCardText>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CxCardText className="bazinga" component="h3">
          Test
        </CxCardText>
      )
      const text = screen.getByText('Test')
      expect(text).toHaveClass('card-text', 'bazinga')
      expect(text.tagName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying paragraph', () => {
      const ref = React.createRef<HTMLParagraphElement>()
      render(<CxCardText ref={ref}>Test</CxCardText>)
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCardText>Test</CxCardText>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

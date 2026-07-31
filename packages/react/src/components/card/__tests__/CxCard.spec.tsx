import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCard } from '../../../index'

describe('CxCard', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      render(<CxCard>Test</CxCard>)
      const card = screen.getByText('Test')
      expect(card).toHaveClass('card')
      expect(card.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCard>Test</CxCard>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('styling props', () => {
    test('applies color, textColor and className together', () => {
      render(
        <CxCard className="bazinga" color="primary" textColor="warning">
          Test
        </CxCard>
      )
      expect(screen.getByText('Test')).toHaveClass('card', 'bg-primary', 'fg-warning', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxCard ref={ref}>Test</CxCard>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCard>Test</CxCard>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

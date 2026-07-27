import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCard } from '../../../index'

describe('CxCard', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      const { container } = render(<CxCard>Test</CxCard>)
      expect(container.firstChild).toHaveClass('card')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCard>Test</CxCard>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('styling props', () => {
    test('applies context, textColor and className together', () => {
      const { container } = render(
        <CxCard className="bazinga" context="primary" textColor="warning">
          Test
        </CxCard>
      )
      expect(container.firstChild).toHaveClass('card', 'bg-primary', 'fg-warning', 'bazinga')
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

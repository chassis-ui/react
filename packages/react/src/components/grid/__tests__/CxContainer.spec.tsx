import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxContainer } from '../../../index'

describe('CxContainer', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      render(<CxContainer>Test</CxContainer>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('container')
      expect(el.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxContainer>Test</CxContainer>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('breakpoint props', () => {
    test('applies the fluid class', () => {
      render(
        <CxContainer className="bazinga" fluid>
          Test
        </CxContainer>
      )
      expect(screen.getByText('Test')).toHaveClass('bazinga', 'container-fluid')
    })

    test('applies a breakpoint class', () => {
      render(
        <CxContainer md className="bazinga">
          Test
        </CxContainer>
      )
      expect(screen.getByText('Test')).toHaveClass('bazinga', 'container-medium')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxContainer ref={ref}>Test</CxContainer>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxContainer>Test</CxContainer>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

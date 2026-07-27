import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxContainer } from '../../../index'

describe('CxContainer', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      const { container } = render(<CxContainer>Test</CxContainer>)
      expect(container.firstChild).toHaveClass('container')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxContainer>Test</CxContainer>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('breakpoint props', () => {
    test('applies the fluid class', () => {
      const { container } = render(
        <CxContainer className="bazinga" fluid>
          Test
        </CxContainer>
      )
      expect(container.firstChild).toHaveClass('bazinga', 'container-fluid')
    })

    test('applies a breakpoint class', () => {
      const { container } = render(
        <CxContainer md className="bazinga">
          Test
        </CxContainer>
      )
      expect(container.firstChild).toHaveClass('bazinga', 'container-medium')
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

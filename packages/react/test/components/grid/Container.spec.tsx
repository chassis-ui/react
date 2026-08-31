import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Container } from '../../../src/index'

describe('Container', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      render(<Container>Test</Container>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('container')
      expect(el.tagName).toBe('DIV')
    })

    test('renders as a custom component', () => {
      render(
        <Container className="bazinga" component="section">
          Test
        </Container>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveClass('container', 'bazinga')
      expect(el.tagName).toBe('SECTION')
    })
  })

  describe('breakpoint props', () => {
    test('applies the fluid class alongside the base class', () => {
      render(
        <Container className="bazinga" fluid>
          Test
        </Container>
      )
      expect(screen.getByText('Test')).toHaveClass('bazinga', 'container', 'fluid')
    })

    test('applies a breakpoint class via fluidUntil alongside the base class', () => {
      render(
        <Container fluidUntil="medium" className="bazinga">
          Test
        </Container>
      )
      expect(screen.getByText('Test')).toHaveClass('bazinga', 'container', 'medium')
    })

    test('applies each fluidUntil breakpoint value', () => {
      const breakpoints = ['small', 'medium', 'large', 'xlarge', '2xlarge'] as const

      breakpoints.forEach((breakpoint) => {
        const { unmount } = render(<Container fluidUntil={breakpoint}>Test</Container>)
        expect(screen.getByText('Test')).toHaveClass('container', breakpoint)
        unmount()
      })
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Container ref={ref}>Test</Container>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Container>Test</Container>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Container } from '../../../index'

describe('Container', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      render(<Container>Test</Container>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('container')
      expect(el.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Container>Test</Container>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('breakpoint props', () => {
    test('applies the fluid class', () => {
      render(
        <Container className="bazinga" fluid>
          Test
        </Container>
      )
      expect(screen.getByText('Test')).toHaveClass('bazinga', 'container-fluid')
    })

    test('applies a breakpoint class', () => {
      render(
        <Container md className="bazinga">
          Test
        </Container>
      )
      expect(screen.getByText('Test')).toHaveClass('bazinga', 'container-medium')
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

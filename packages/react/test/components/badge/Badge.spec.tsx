import * as React from 'react'
import { render, screen, within } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Badge } from '../../../src/index'

describe('Badge', () => {
  describe('rendering', () => {
    test('renders a span with the base and color class by default', () => {
      render(<Badge color="primary">Test</Badge>)
      const badge = screen.getByText('Test')
      expect(badge).toHaveClass('badge', 'primary')
      expect(badge.tagName).toBe('SPAN')
    })

    test('renders as a custom component with circle and size classes', () => {
      render(
        <Badge className="bazinga" color="warning" component="div" circle size="small">
          Test
        </Badge>
      )
      const badge = screen.getByText('Test')
      expect(badge).toHaveClass('badge', 'warning', 'circle', 'small', 'bazinga')
      expect(badge.tagName).toBe('DIV')
    })
  })

  describe('styling props', () => {
    test('applies the outline and smooth variant classes', () => {
      const { container: outline } = render(
        <Badge color="primary" variant="outline">
          Test
        </Badge>
      )
      expect(within(outline).getByText('Test')).toHaveClass('outline')

      const { container: smooth } = render(
        <Badge color="primary" variant="smooth">
          Test
        </Badge>
      )
      expect(within(smooth).getByText('Test')).toHaveClass('smooth')
    })

    test('positions the badge in the top-end corner', () => {
      render(
        <Badge color="danger" position="top-end">
          Test
        </Badge>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'position-absolute',
        'translate-middle',
        'top-0',
        'start-100'
      )
    })

    test('positions the badge in the bottom-start corner', () => {
      render(
        <Badge color="danger" position="bottom-start">
          Test
        </Badge>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'position-absolute',
        'translate-middle',
        'top-100',
        'start-0'
      )
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<Badge ref={ref}>Test</Badge>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Badge color="primary">Test</Badge>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

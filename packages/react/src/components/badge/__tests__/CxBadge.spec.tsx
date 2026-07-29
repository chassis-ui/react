import * as React from 'react'
import { render, screen, within } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxBadge } from '../../../index'

describe('CxBadge', () => {
  describe('rendering', () => {
    test('renders a span with the base and context class by default', () => {
      render(<CxBadge context="primary">Test</CxBadge>)
      const badge = screen.getByText('Test')
      expect(badge).toHaveClass('badge', 'primary')
      expect(badge.tagName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxBadge context="primary">Test</CxBadge>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with circle and size classes', () => {
      render(
        <CxBadge className="bazinga" context="warning" component="div" circle size="small">
          Test
        </CxBadge>
      )
      const badge = screen.getByText('Test')
      expect(badge).toHaveClass('badge', 'warning', 'circle', 'small', 'bazinga')
      expect(badge.tagName).toBe('DIV')
    })
  })

  describe('styling props', () => {
    test('applies the outline and smooth variant classes', () => {
      const { container: outline } = render(
        <CxBadge context="primary" variant="outline">
          Test
        </CxBadge>
      )
      expect(within(outline).getByText('Test')).toHaveClass('outline')

      const { container: smooth } = render(
        <CxBadge context="primary" variant="smooth">
          Test
        </CxBadge>
      )
      expect(within(smooth).getByText('Test')).toHaveClass('smooth')
    })

    test('positions the badge in the top-end corner', () => {
      render(
        <CxBadge context="danger" position="top-end">
          Test
        </CxBadge>
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
        <CxBadge context="danger" position="bottom-start">
          Test
        </CxBadge>
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
      render(<CxBadge ref={ref}>Test</CxBadge>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxBadge context="primary">Test</CxBadge>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxBadge } from '../../../index'

describe('CxBadge', () => {
  describe('rendering', () => {
    test('renders a span with the base and context class by default', () => {
      const { container } = render(<CxBadge context="primary">Test</CxBadge>)
      expect(container.firstChild).toHaveClass('badge', 'primary')
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxBadge context="primary">Test</CxBadge>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with circle and size classes', () => {
      const { container } = render(
        <CxBadge className="bazinga" context="warning" component="div" circle size="small">
          Test
        </CxBadge>
      )
      expect(container.firstChild).toHaveClass('badge', 'warning', 'circle', 'small', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })
  })

  describe('styling props', () => {
    test('applies the outline and smooth variant classes', () => {
      const { container: outline } = render(
        <CxBadge context="primary" variant="outline">
          Test
        </CxBadge>
      )
      expect(outline.firstChild).toHaveClass('outline')

      const { container: smooth } = render(
        <CxBadge context="primary" variant="smooth">
          Test
        </CxBadge>
      )
      expect(smooth.firstChild).toHaveClass('smooth')
    })

    test('positions the badge in the top-end corner', () => {
      const { container } = render(
        <CxBadge context="danger" position="top-end">
          Test
        </CxBadge>
      )
      expect(container.firstChild).toHaveClass(
        'position-absolute',
        'translate-middle',
        'top-0',
        'start-100'
      )
    })

    test('positions the badge in the bottom-start corner', () => {
      const { container } = render(
        <CxBadge context="danger" position="bottom-start">
          Test
        </CxBadge>
      )
      expect(container.firstChild).toHaveClass(
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

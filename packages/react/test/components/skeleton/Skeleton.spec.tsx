import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Skeleton } from '../../../src/index'

describe('Skeleton', () => {
  // A decorative loading skeleton with no text/role - there's no accessible query for it.
  /* eslint-disable testing-library/no-node-access */
  describe('rendering', () => {
    test('renders a span with the base class by default', () => {
      const { container } = render(<Skeleton color="primary" />)
      expect(container.firstChild).toHaveClass('skeleton', 'bg-primary')
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })

    test('renders as a custom component', () => {
      const { container } = render(<Skeleton component="div" />)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })
  })

  describe('styling props', () => {
    test('applies color, breakpoint and className together', () => {
      const { container } = render(
        <Skeleton className="bazinga" color="secondary" responsive={{ small: 7 }} />
      )
      expect(container.firstChild).toHaveClass('skeleton', 'bg-secondary', 'small:col-7', 'bazinga')
    })

    test('adds no width class when span is unset, leaving intrinsic sizing to the element', () => {
      const { container } = render(<Skeleton />)
      expect(container.firstChild).not.toHaveClass('w-100', 'col')
    })

    test('adds a column class when span is set to a number', () => {
      const { container } = render(<Skeleton span={4} />)
      expect(container.firstChild).toHaveClass('col-4')
    })

    test('renders the glow animation class alongside the base class', () => {
      const { container } = render(<Skeleton animation="glow" />)
      expect(container.firstChild).toHaveClass('skeleton', 'skeleton-glow')
    })

    test('renders the wave animation class alongside the base class', () => {
      const { container } = render(<Skeleton animation="wave" />)
      expect(container.firstChild).toHaveClass('skeleton', 'skeleton-wave')
    })
  })
  /* eslint-enable testing-library/no-node-access */

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<Skeleton ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Skeleton color="primary" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

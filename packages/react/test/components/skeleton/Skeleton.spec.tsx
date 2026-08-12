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

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Skeleton color="primary" />)
      expect(container).toMatchSnapshot()
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

    test('renders the glow animation class instead of the base class', () => {
      const { container } = render(<Skeleton animation="glow" />)
      expect(container.firstChild).toHaveClass('skeleton-glow')
      expect(container.firstChild).not.toHaveClass('skeleton')
    })

    test('renders the wave animation class instead of the base class', () => {
      const { container } = render(<Skeleton animation="wave" />)
      expect(container.firstChild).toHaveClass('skeleton-wave')
      expect(container.firstChild).not.toHaveClass('skeleton')
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

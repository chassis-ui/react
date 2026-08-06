import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Placeholder } from '../../../src/index'

describe('Placeholder', () => {
  // A decorative loading skeleton with no text/role - there's no accessible query for it.
  /* eslint-disable testing-library/no-node-access */
  describe('rendering', () => {
    test('renders a span with the base class by default', () => {
      const { container } = render(<Placeholder color="primary" />)
      expect(container.firstChild).toHaveClass('placeholder', 'bg-primary')
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Placeholder color="primary" />)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component', () => {
      const { container } = render(<Placeholder component="div" />)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })
  })

  describe('styling props', () => {
    test('applies animation, size, breakpoint and className together', () => {
      const { container } = render(
        <Placeholder animation="glow" className="bazinga" color="secondary" size="large" sm={7} />
      )
      expect(container.firstChild).toHaveClass(
        'placeholder-glow',
        'bg-secondary',
        'placeholder-large',
        'small:col-7',
        'bazinga'
      )
    })

    test('applies the wave animation class', () => {
      const { container } = render(<Placeholder animation="wave" />)
      expect(container.firstChild).toHaveClass('placeholder-wave')
    })
  })
  /* eslint-enable testing-library/no-node-access */

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<Placeholder ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Placeholder color="primary" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

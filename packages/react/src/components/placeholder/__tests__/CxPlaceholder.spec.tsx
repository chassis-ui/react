import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxPlaceholder } from '../../../index'

describe('CxPlaceholder', () => {
  describe('rendering', () => {
    test('renders a span with the base class by default', () => {
      const { container } = render(<CxPlaceholder context="primary" />)
      expect(container.firstChild).toHaveClass('placeholder', 'bg-primary')
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxPlaceholder context="primary" />)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component', () => {
      const { container } = render(<CxPlaceholder component="div" />)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })
  })

  describe('styling props', () => {
    test('applies animation, size, breakpoint and className together', () => {
      const { container } = render(
        <CxPlaceholder
          animation="glow"
          className="bazinga"
          context="secondary"
          size="large"
          sm={7}
        />
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
      const { container } = render(<CxPlaceholder animation="wave" />)
      expect(container.firstChild).toHaveClass('placeholder-wave')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<CxPlaceholder ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxPlaceholder context="primary" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

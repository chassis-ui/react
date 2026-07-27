import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxNavbarText } from '../../../index'

describe('CxNavbarText', () => {
  describe('rendering', () => {
    test('renders a span with the base class and className merged', () => {
      const { container } = render(<CxNavbarText className="bazinga">Test</CxNavbarText>)
      expect(container.firstChild).toHaveClass('navbar-text', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxNavbarText>Test</CxNavbarText>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<CxNavbarText ref={ref}>Test</CxNavbarText>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxNavbarText>Test</CxNavbarText>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

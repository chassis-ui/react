import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCardBody } from '../../../index'

describe('CxCardBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      const { container } = render(<CxCardBody className="bazinga">Test</CxCardBody>)
      expect(container.firstChild).toHaveClass('card-body', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCardBody>Test</CxCardBody>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxCardBody ref={ref}>Test</CxCardBody>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCardBody>Test</CxCardBody>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

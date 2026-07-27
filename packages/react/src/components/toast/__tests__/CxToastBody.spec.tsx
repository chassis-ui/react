import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxToastBody } from '../../../index'

describe('CxToastBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      const { container } = render(<CxToastBody className="bazinga">Test</CxToastBody>)
      expect(container.firstChild).toHaveClass('toast-body', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxToastBody>Test</CxToastBody>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxToastBody ref={ref}>Test</CxToastBody>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxToastBody>Test</CxToastBody>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

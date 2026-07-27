import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxDrawerBody } from '../../../index'

describe('CxDrawerBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      const { container } = render(<CxDrawerBody className="bazinga">Test</CxDrawerBody>)
      expect(container.firstChild).toHaveClass('drawer-body', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxDrawerBody>Test</CxDrawerBody>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxDrawerBody ref={ref}>Test</CxDrawerBody>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxDrawerBody>Test</CxDrawerBody>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxDrawerBody } from '../../../index'

describe('CxDrawerBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CxDrawerBody className="bazinga">Test</CxDrawerBody>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('drawer-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
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

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCardBody } from '../../../index'

describe('CxCardBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CxCardBody className="bazinga">Test</CxCardBody>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('card-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
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

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxToastBody } from '../../../index'

describe('CxToastBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CxToastBody className="bazinga">Test</CxToastBody>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('toast-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
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

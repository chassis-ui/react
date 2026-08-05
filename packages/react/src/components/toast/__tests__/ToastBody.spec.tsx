import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ToastBody } from '../../../index'

describe('ToastBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<ToastBody className="bazinga">Test</ToastBody>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('toast-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<ToastBody>Test</ToastBody>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ToastBody ref={ref}>Test</ToastBody>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<ToastBody>Test</ToastBody>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

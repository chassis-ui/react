import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Toast } from '../../../index'

describe('Toast.Body', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<Toast.Body className="bazinga">Test</Toast.Body>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('toast-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Toast.Body>Test</Toast.Body>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Toast.Body ref={ref}>Test</Toast.Body>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Toast.Body>Test</Toast.Body>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

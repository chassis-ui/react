import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ToastFooter } from '../../../src/index'

describe('ToastFooter', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<ToastFooter className="bazinga">Test</ToastFooter>)
      const footer = screen.getByText('Test')
      expect(footer).toHaveClass('toast-footer', 'bazinga')
      expect(footer.tagName).toBe('DIV')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ToastFooter ref={ref}>Test</ToastFooter>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<ToastFooter>Test</ToastFooter>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

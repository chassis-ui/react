import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxModalFooter } from '../../../index'

describe('CxModalFooter', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CxModalFooter className="bazinga">Test</CxModalFooter>)
      const footer = screen.getByText('Test')
      expect(footer).toHaveClass('modal-footer', 'bazinga')
      expect(footer.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxModalFooter>Test</CxModalFooter>)
      expect(container).toMatchSnapshot()
    })

    test('applies the stacked class', () => {
      render(<CxModalFooter stacked>Test</CxModalFooter>)
      expect(screen.getByText('Test')).toHaveClass('modal-footer', 'stacked')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxModalFooter ref={ref}>Test</CxModalFooter>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxModalFooter>Test</CxModalFooter>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

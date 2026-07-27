import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxFormFloating } from '../../../index'

describe('CxFormFloating', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      const { container } = render(<CxFormFloating className="bazinga">Test</CxFormFloating>)
      expect(container.firstChild).toHaveClass('form-floating', 'bazinga')
      expect(container.firstChild).toHaveTextContent('Test')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxFormFloating>Test</CxFormFloating>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxFormFloating ref={ref}>Test</CxFormFloating>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxFormFloating>Test</CxFormFloating>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

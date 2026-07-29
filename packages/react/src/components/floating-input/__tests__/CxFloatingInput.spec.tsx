import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxFloatingInput } from '../../../index'

describe('CxFloatingInput', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CxFloatingInput className="bazinga">Test</CxFloatingInput>)
      expect(screen.getByText('Test')).toHaveClass('form-floating', 'bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxFloatingInput>Test</CxFloatingInput>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxFloatingInput ref={ref}>Test</CxFloatingInput>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxFloatingInput>Test</CxFloatingInput>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

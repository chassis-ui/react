import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { FloatingInput } from '../../../index'

describe('FloatingInput', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<FloatingInput className="bazinga">Test</FloatingInput>)
      expect(screen.getByText('Test')).toHaveClass('form-floating', 'bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<FloatingInput>Test</FloatingInput>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<FloatingInput ref={ref}>Test</FloatingInput>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<FloatingInput>Test</FloatingInput>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

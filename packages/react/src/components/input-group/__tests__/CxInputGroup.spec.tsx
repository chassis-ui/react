import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxInputGroup } from '../../../index'

describe('CxInputGroup', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      render(<CxInputGroup>Test</CxInputGroup>)
      const group = screen.getByText('Test')
      expect(group).toHaveClass('input-group')
      expect(group.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxInputGroup>Test</CxInputGroup>)
      expect(container).toMatchSnapshot()
    })

    test('applies size class and className together', () => {
      render(
        <CxInputGroup className="bazinga" size="large">
          Test
        </CxInputGroup>
      )
      expect(screen.getByText('Test')).toHaveClass('input-group', 'large', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxInputGroup ref={ref}>Test</CxInputGroup>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxInputGroup>Test</CxInputGroup>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

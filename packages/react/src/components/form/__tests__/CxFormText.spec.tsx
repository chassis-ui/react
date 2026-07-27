import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxFormText } from '../../../index'

describe('CxFormText', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      const { container } = render(<CxFormText>Test</CxFormText>)
      expect(container.firstChild).toHaveClass('form-help')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxFormText>Test</CxFormText>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      const { container } = render(
        <CxFormText className="bazinga" component="h3">
          Test
        </CxFormText>
      )
      expect(container.firstChild).toHaveClass('form-help', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxFormText ref={ref}>Test</CxFormText>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxFormText>Test</CxFormText>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

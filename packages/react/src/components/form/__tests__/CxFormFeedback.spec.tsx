import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxFormFeedback } from '../../../index'

describe('CxFormFeedback', () => {
  describe('rendering', () => {
    test('renders a div by default with no validation classes', () => {
      const { container } = render(<CxFormFeedback>Test</CxFormFeedback>)
      expect(container.firstChild?.nodeName).toBe('DIV')
      expect(container.firstChild).toHaveAttribute('class', '')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxFormFeedback invalid>Test</CxFormFeedback>)
      expect(container).toMatchSnapshot()
    })

    test('applies invalid/valid feedback classes with className', () => {
      const { container } = render(
        <CxFormFeedback className="bazinga" invalid={true} valid={true}>
          Test
        </CxFormFeedback>
      )
      expect(container.firstChild).toHaveClass('invalid-feedback', 'valid-feedback', 'bazinga')
    })

    test('applies tooltip variant classes', () => {
      const { container } = render(
        <CxFormFeedback invalid={true} valid={true} tooltip={true}>
          Test
        </CxFormFeedback>
      )
      expect(container.firstChild).toHaveClass('invalid-tooltip', 'valid-tooltip')
    })

    test('renders as a custom component', () => {
      const { container } = render(
        <CxFormFeedback component="span" invalid>
          Test
        </CxFormFeedback>
      )
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxFormFeedback ref={ref}>Test</CxFormFeedback>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxFormFeedback invalid>Test</CxFormFeedback>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

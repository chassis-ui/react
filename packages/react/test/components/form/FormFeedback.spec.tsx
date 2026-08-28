import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { FormFeedback } from '../../../src/index'

describe('FormFeedback', () => {
  describe('rendering', () => {
    test('renders a div by default with no validation classes', () => {
      const { container } = render(<FormFeedback>Test</FormFeedback>)
      expect(container.firstChild?.nodeName).toBe('DIV')
      expect(screen.getByText('Test')).toHaveAttribute('class', '')
    })

    test('applies invalid/valid feedback classes with className', () => {
      render(
        <FormFeedback className="bazinga" invalid={true} valid={true}>
          Test
        </FormFeedback>
      )
      expect(screen.getByText('Test')).toHaveClass('invalid-feedback', 'valid-feedback', 'bazinga')
    })

    test('applies tooltip variant classes', () => {
      render(
        <FormFeedback invalid={true} valid={true} tooltip={true}>
          Test
        </FormFeedback>
      )
      expect(screen.getByText('Test')).toHaveClass('invalid-tooltip', 'valid-tooltip')
    })

    test('renders as a custom component', () => {
      const { container } = render(
        <FormFeedback component="span" invalid>
          Test
        </FormFeedback>
      )
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<FormFeedback ref={ref}>Test</FormFeedback>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<FormFeedback invalid>Test</FormFeedback>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

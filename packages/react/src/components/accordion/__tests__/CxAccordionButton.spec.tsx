import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxAccordionButton } from '../../../index'

// @deprecated — CxAccordionHeader already renders its own `.accordion-title` wrapper, so this
// component is only kept around for API compatibility. Tests cover its current behavior, not
// a recommended usage.
describe('CxAccordionButton', () => {
  describe('rendering', () => {
    test('renders a span with the base class and className merged', () => {
      render(<CxAccordionButton className="bazinga">Test</CxAccordionButton>)
      const button = screen.getByText('Test')
      expect(button).toHaveClass('accordion-title', 'bazinga')
      expect(button.tagName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxAccordionButton>Test</CxAccordionButton>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<CxAccordionButton ref={ref}>Test</CxAccordionButton>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxAccordionButton>Test</CxAccordionButton>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

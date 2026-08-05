import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { AccordionButton } from '../../../index'

// @deprecated — AccordionHeader already renders its own `.accordion-title` wrapper, so this
// component is only kept around for API compatibility. Tests cover its current behavior, not
// a recommended usage.
describe('AccordionButton', () => {
  describe('rendering', () => {
    test('renders a span with the base class and className merged', () => {
      render(<AccordionButton className="bazinga">Test</AccordionButton>)
      const button = screen.getByText('Test')
      expect(button).toHaveClass('accordion-title', 'bazinga')
      expect(button.tagName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<AccordionButton>Test</AccordionButton>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<AccordionButton ref={ref}>Test</AccordionButton>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<AccordionButton>Test</AccordionButton>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

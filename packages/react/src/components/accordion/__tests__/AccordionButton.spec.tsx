import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Accordion } from '../../../index'

// @deprecated — AccordionHeader already renders its own `.accordion-title` wrapper, so this
// component is only kept around for API compatibility. Tests cover its current behavior, not
// a recommended usage.
describe('Accordion.Button', () => {
  describe('rendering', () => {
    test('renders a span with the base class and className merged', () => {
      render(<Accordion.Button className="bazinga">Test</Accordion.Button>)
      const button = screen.getByText('Test')
      expect(button).toHaveClass('accordion-title', 'bazinga')
      expect(button.tagName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Accordion.Button>Test</Accordion.Button>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<Accordion.Button ref={ref}>Test</Accordion.Button>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Accordion.Button>Test</Accordion.Button>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

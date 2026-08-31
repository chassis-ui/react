import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { AccordionBody } from '../../../src/index'

describe('AccordionBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<AccordionBody className="bazinga">Test</AccordionBody>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('accordion-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<AccordionBody ref={ref}>Test</AccordionBody>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<AccordionBody>Test</AccordionBody>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

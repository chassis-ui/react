import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxAccordionBody } from '../../../index'

describe('CxAccordionBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CxAccordionBody className="bazinga">Test</CxAccordionBody>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('accordion-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxAccordionBody>Test</CxAccordionBody>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxAccordionBody ref={ref}>Test</CxAccordionBody>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxAccordionBody>Test</CxAccordionBody>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

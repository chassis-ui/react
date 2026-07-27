import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxAccordionBody } from '../../../index'

describe('CxAccordionBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      const { container } = render(<CxAccordionBody className="bazinga">Test</CxAccordionBody>)
      expect(container.firstChild).toHaveClass('accordion-body', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('DIV')
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

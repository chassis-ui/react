import React from 'react'
import { render, screen } from '@testing-library/react'

import { AccordionCollapse } from '../../../index'

// @deprecated — native <details>/<summary> handles collapse now; this is a no-op passthrough
// kept for API compatibility. Tests document that it renders only its children, ignoring every
// other prop (className included) — that's the point of a passthrough, not a gap to fix.
describe('AccordionCollapse', () => {
  describe('rendering', () => {
    test('renders only its children, unwrapped', () => {
      render(<AccordionCollapse>Test</AccordionCollapse>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<AccordionCollapse>Test</AccordionCollapse>)
      expect(container).toMatchSnapshot()
    })

    test('ignores className and other props entirely', () => {
      const { container } = render(<AccordionCollapse className="bazinga">Test</AccordionCollapse>)
      expect(container.innerHTML).toBe('Test')
    })
  })
})

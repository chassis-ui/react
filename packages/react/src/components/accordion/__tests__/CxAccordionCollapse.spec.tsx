import React from 'react'
import { render, screen } from '@testing-library/react'

import { CxAccordionCollapse } from '../../../index'

// @deprecated — native <details>/<summary> handles collapse now; this is a no-op passthrough
// kept for API compatibility. Tests document that it renders only its children, ignoring every
// other prop (className included) — that's the point of a passthrough, not a gap to fix.
describe('CxAccordionCollapse', () => {
  describe('rendering', () => {
    test('renders only its children, unwrapped', () => {
      render(<CxAccordionCollapse>Test</CxAccordionCollapse>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxAccordionCollapse>Test</CxAccordionCollapse>)
      expect(container).toMatchSnapshot()
    })

    test('ignores className and other props entirely', () => {
      const { container } = render(
        <CxAccordionCollapse className="bazinga">Test</CxAccordionCollapse>
      )
      expect(container.innerHTML).toBe('Test')
    })
  })
})

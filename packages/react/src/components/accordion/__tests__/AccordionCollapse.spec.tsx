import React from 'react'
import { render, screen } from '@testing-library/react'

import { Accordion } from '../../../index'

// @deprecated — native <details>/<summary> handles collapse now; this is a no-op passthrough
// kept for API compatibility. Tests document that it renders only its children, ignoring every
// other prop (className included) — that's the point of a passthrough, not a gap to fix.
describe('Accordion.Collapse', () => {
  describe('rendering', () => {
    test('renders only its children, unwrapped', () => {
      render(<Accordion.Collapse>Test</Accordion.Collapse>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Accordion.Collapse>Test</Accordion.Collapse>)
      expect(container).toMatchSnapshot()
    })

    test('ignores className and other props entirely', () => {
      const { container } = render(
        <Accordion.Collapse className="bazinga">Test</Accordion.Collapse>
      )
      expect(container.innerHTML).toBe('Test')
    })
  })
})

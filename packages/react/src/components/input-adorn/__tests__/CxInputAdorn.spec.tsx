import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxInputAdorn } from '../../../index'

describe('CxInputAdorn', () => {
  describe('rendering', () => {
    test('renders a span with the base class by default', () => {
      render(<CxInputAdorn>Test</CxInputAdorn>)
      const adorn = screen.getByText('Test')
      expect(adorn).toHaveClass('input-help')
      expect(adorn.tagName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxInputAdorn>Test</CxInputAdorn>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CxInputAdorn className="bazinga" component="button" type="button" aria-label="Clear">
          Test
        </CxInputAdorn>
      )
      const adorn = screen.getByRole('button', { name: 'Clear' })
      expect(adorn).toHaveClass('input-help', 'bazinga')
      expect(adorn.tagName).toBe('BUTTON')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<CxInputAdorn ref={ref}>Test</CxInputAdorn>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxInputAdorn>Test</CxInputAdorn>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

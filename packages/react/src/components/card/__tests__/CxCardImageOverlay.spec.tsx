import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCardImageOverlay } from '../../../index'

describe('CxCardImageOverlay', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      const { container } = render(
        <CxCardImageOverlay className="bazinga">Test</CxCardImageOverlay>
      )
      expect(container.firstChild).toHaveClass('card-overlay', 'bazinga')
      expect(container.firstChild).toHaveTextContent('Test')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCardImageOverlay>Test</CxCardImageOverlay>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxCardImageOverlay ref={ref}>Test</CxCardImageOverlay>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCardImageOverlay>Test</CxCardImageOverlay>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxButtonToolbar, CxButtonGroup, CxButton } from '../../../index'

describe('CxButtonToolbar', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      const { container } = render(<CxButtonToolbar>Test</CxButtonToolbar>)
      expect(container.firstChild).toHaveClass('button-toolbar')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxButtonToolbar role="group" aria-label="Bazinga">
          <CxButtonGroup role="group">
            <CxButton>1</CxButton>
            <CxButton>2</CxButton>
          </CxButtonGroup>
          <CxButtonGroup role="group">
            <CxButton>A</CxButton>
            <CxButton>B</CxButton>
          </CxButtonGroup>
        </CxButtonToolbar>
      )
      expect(container).toMatchSnapshot()
    })

    test('applies className', () => {
      const { container } = render(<CxButtonToolbar className="bazinga">Test</CxButtonToolbar>)
      expect(container.firstChild).toHaveClass('button-toolbar', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxButtonToolbar ref={ref}>Test</CxButtonToolbar>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxButtonToolbar role="group" aria-label="Bazinga">
          <CxButtonGroup role="group" aria-label="First group">
            <CxButton>1</CxButton>
            <CxButton>2</CxButton>
          </CxButtonGroup>
        </CxButtonToolbar>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

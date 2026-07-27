import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxButtonGroup, CxButton } from '../../../index'

describe('CxButtonGroup', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      const { container } = render(<CxButtonGroup>Test</CxButtonGroup>)
      expect(container.firstChild).toHaveClass('button-group')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxButtonGroup>
          <CxButton>A</CxButton>
          <CxButton>B</CxButton>
          <CxButton>C</CxButton>
        </CxButtonGroup>
      )
      expect(container).toMatchSnapshot()
    })

    test('applies size and vertical classes with className', () => {
      const { container } = render(
        <CxButtonGroup className="bazinga" size="large" vertical>
          <CxButton>A</CxButton>
        </CxButtonGroup>
      )
      expect(container.firstChild).toHaveClass('button-group', 'large', 'vertical', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxButtonGroup ref={ref}>Test</CxButtonGroup>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxButtonGroup role="group" aria-label="Actions">
          <CxButton>A</CxButton>
          <CxButton>B</CxButton>
        </CxButtonGroup>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

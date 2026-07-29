import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxButtonGroup, CxButton } from '../../../index'

describe('CxButtonGroup', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      render(<CxButtonGroup>Test</CxButtonGroup>)
      const group = screen.getByText('Test')
      expect(group).toHaveClass('button-group')
      expect(group.tagName).toBe('DIV')
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
      render(
        <CxButtonGroup className="bazinga" size="large" vertical>
          <CxButton>A</CxButton>
        </CxButtonGroup>
      )
      // The group wrapper has no default role (only when a caller passes one explicitly, as
      // the accessibility test below does), so its only queryable ancestor is the button's
      // parent element.
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByRole('button', { name: 'A' }).parentElement).toHaveClass(
        'button-group',
        'large',
        'vertical',
        'bazinga'
      )
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

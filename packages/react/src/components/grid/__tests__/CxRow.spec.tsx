import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxRow } from '../../../index'

describe('CxRow', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      const { container } = render(<CxRow>Test</CxRow>)
      expect(container.firstChild).toHaveClass('row')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxRow>Test</CxRow>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('breakpoint props', () => {
    test('applies cols classes per breakpoint', () => {
      const { container } = render(
        <CxRow
          className="bazinga"
          xs={{ cols: 1 }}
          sm={{ cols: 2 }}
          md={{ cols: 3 }}
          lg={{ cols: 4 }}
          xl={{ cols: 5 }}
          xxl={{ cols: 6 }}
        >
          Test
        </CxRow>
      )
      expect(container.firstChild).toHaveClass(
        'bazinga',
        'row-cols-1',
        'small:row-cols-2',
        'medium:row-cols-3',
        'large:row-cols-4',
        'xlarge:row-cols-5',
        '2xlarge:row-cols-6'
      )
    })

    test('applies gutter, gutterX and gutterY classes per breakpoint', () => {
      const { container } = render(
        <CxRow
          xs={{ gutter: 1 }}
          sm={{ gutterX: 2 }}
          md={{ gutterY: 3 }}
          lg={{ gutter: 4 }}
          xl={{ gutterX: 5 }}
          xxl={{ gutterY: 6 }}
        >
          Test
        </CxRow>
      )
      expect(container.firstChild).toHaveClass(
        'g-1',
        'small:gx-2',
        'medium:gy-3',
        'large:g-4',
        'xlarge:gx-5',
        '2xlarge:gy-6'
      )
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxRow ref={ref}>Test</CxRow>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxRow>Test</CxRow>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

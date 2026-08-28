import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Row } from '../../../src/index'

describe('Row', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      render(<Row>Test</Row>)
      const row = screen.getByText('Test')
      expect(row).toHaveClass('row')
      expect(row.tagName).toBe('DIV')
    })
  })

  describe('breakpoint props', () => {
    test('applies cols classes per breakpoint', () => {
      render(
        <Row
          className="bazinga"
          cols={1}
          responsive={{
            small: { cols: 2 },
            medium: { cols: 3 },
            large: { cols: 4 },
            xlarge: { cols: 5 },
            '2xlarge': { cols: 6 }
          }}
        >
          Test
        </Row>
      )
      expect(screen.getByText('Test')).toHaveClass(
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
      render(
        <Row
          gutter="small"
          responsive={{
            small: { gutterX: 'medium' },
            medium: { gutterY: 'large' },
            large: { gutter: 'xlarge' },
            xlarge: { gutterX: '2xlarge' },
            '2xlarge': { gutterY: 'zero' }
          }}
        >
          Test
        </Row>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'g-small',
        'small:gx-medium',
        'medium:gy-large',
        'large:g-xlarge',
        'xlarge:gx-2xlarge',
        '2xlarge:gy-zero'
      )
    })

    test('applies the literal 0 gutter shorthand', () => {
      render(
        <Row gutter={0} responsive={{ small: { gutterX: 0 }, medium: { gutterY: 0 } }}>
          Test
        </Row>
      )
      expect(screen.getByText('Test')).toHaveClass('g-0', 'small:gx-0', 'medium:gy-0')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Row ref={ref}>Test</Row>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Row>Test</Row>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

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
            sm: { cols: 2 },
            md: { cols: 3 },
            lg: { cols: 4 },
            xl: { cols: 5 },
            '2xl': { cols: 6 }
          }}
        >
          Test
        </Row>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'bazinga',
        'row-cols-1',
        'sm:row-cols-2',
        'md:row-cols-3',
        'lg:row-cols-4',
        'xl:row-cols-5',
        '2xl:row-cols-6'
      )
    })

    test('applies gutter, gutterX and gutterY classes per breakpoint', () => {
      render(
        <Row
          gutter="sm"
          responsive={{
            sm: { gutterX: 'md' },
            md: { gutterY: 'lg' },
            lg: { gutter: 'xl' },
            xl: { gutterX: '2xl' },
            '2xl': { gutterY: 'zero' }
          }}
        >
          Test
        </Row>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'g-sm',
        'sm:gx-md',
        'md:gy-lg',
        'lg:g-xl',
        'xl:gx-2xl',
        '2xl:gy-zero'
      )
    })

    test('applies the literal 0 gutter shorthand', () => {
      render(
        <Row gutter={0} responsive={{ sm: { gutterX: 0 }, md: { gutterY: 0 } }}>
          Test
        </Row>
      )
      expect(screen.getByText('Test')).toHaveClass('g-0', 'sm:gx-0', 'md:gy-0')
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

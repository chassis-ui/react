import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Col } from '../../../src/index'

describe('Col', () => {
  describe('rendering', () => {
    test('renders a div with the base class when no breakpoints are set', () => {
      render(<Col>Test</Col>)
      const col = screen.getByText('Test')
      expect(col).toHaveClass('col')
      expect(col.tagName).toBe('DIV')
    })
  })

  describe('breakpoint props', () => {
    test('applies numeric span classes per breakpoint', () => {
      render(
        <Col
          className="bazinga"
          span={1}
          responsive={{
            sm: { span: 2 },
            md: { span: 3 },
            lg: { span: 4 },
            xl: { span: 5 },
            '2xl': { span: 6 }
          }}
        >
          Test
        </Col>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'bazinga',
        'col-1',
        'sm:col-2',
        'md:col-3',
        'lg:col-4',
        'xl:col-5',
        '2xl:col-6'
      )
    })

    test('applies boolean auto-width classes per breakpoint', () => {
      render(
        <Col
          span
          responsive={{
            sm: { span: true },
            md: { span: true },
            lg: { span: true },
            xl: { span: true },
            '2xl': { span: true }
          }}
        >
          Test
        </Col>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'col',
        'sm:col',
        'md:col',
        'lg:col',
        'xl:col',
        '2xl:col'
      )
    })

    test('applies span/order/offset from a responsive breakpoint override', () => {
      render(<Col responsive={{ md: { span: 6, order: 'first', offset: 2 } }}>Test</Col>)
      expect(screen.getByText('Test')).toHaveClass(
        'col',
        'md:col-6',
        'md:order-first',
        'md:offset-2'
      )
    })
  })

  describe('base class fallback', () => {
    test('keeps the base col class when only offset is set (no span)', () => {
      render(<Col offset={2}>Test</Col>)
      expect(screen.getByText('Test')).toHaveClass('col', 'offset-2')
    })

    test('keeps the base col class when only order is set (no span)', () => {
      render(<Col order="first">Test</Col>)
      expect(screen.getByText('Test')).toHaveClass('col', 'order-first')
    })

    test('omits the base col class once a base span is set', () => {
      render(<Col span={6}>Test</Col>)
      const col = screen.getByText('Test')
      expect(col).toHaveClass('col-6')
      expect(col).not.toHaveClass('col')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Col ref={ref}>Test</Col>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Col>Test</Col>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

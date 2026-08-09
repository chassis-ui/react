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

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Col>Test</Col>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('breakpoint props', () => {
    test('applies numeric span classes per breakpoint', () => {
      render(
        <Col
          className="bazinga"
          span={1}
          responsive={{
            small: { span: 2 },
            medium: { span: 3 },
            large: { span: 4 },
            xlarge: { span: 5 },
            '2xlarge': { span: 6 }
          }}
        >
          Test
        </Col>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'bazinga',
        'col-1',
        'small:col-2',
        'medium:col-3',
        'large:col-4',
        'xlarge:col-5',
        '2xlarge:col-6'
      )
    })

    test('applies boolean auto-width classes per breakpoint', () => {
      render(
        <Col
          span
          responsive={{
            small: { span: true },
            medium: { span: true },
            large: { span: true },
            xlarge: { span: true },
            '2xlarge': { span: true }
          }}
        >
          Test
        </Col>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'col',
        'small:col',
        'medium:col',
        'large:col',
        'xlarge:col',
        '2xlarge:col'
      )
    })

    test('applies span/order/offset from a responsive breakpoint override', () => {
      render(<Col responsive={{ medium: { span: 6, order: 'first', offset: 2 } }}>Test</Col>)
      expect(screen.getByText('Test')).toHaveClass(
        'medium:col-6',
        'medium:order-first',
        'medium:offset-2'
      )
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

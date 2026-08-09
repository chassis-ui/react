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

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Row>Test</Row>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('breakpoint props', () => {
    test('applies cols classes per breakpoint', () => {
      render(
        <Row
          className="bazinga"
          xs={{ cols: 1 }}
          sm={{ cols: 2 }}
          md={{ cols: 3 }}
          lg={{ cols: 4 }}
          xl={{ cols: 5 }}
          xxl={{ cols: 6 }}
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
          xs={{ gutter: 'small' }}
          sm={{ gutterX: 'medium' }}
          md={{ gutterY: 'large' }}
          lg={{ gutter: 'xlarge' }}
          xl={{ gutterX: '2xlarge' }}
          xxl={{ gutterY: 'zero' }}
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
        <Row xs={{ gutter: 0 }} sm={{ gutterX: 0 }} md={{ gutterY: 0 }}>
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

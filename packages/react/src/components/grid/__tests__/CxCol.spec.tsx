import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCol } from '../../../index'

describe('CxCol', () => {
  describe('rendering', () => {
    test('renders a div with the base class when no breakpoints are set', () => {
      const { container } = render(<CxCol>Test</CxCol>)
      expect(container.firstChild).toHaveClass('col')
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCol>Test</CxCol>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('breakpoint props', () => {
    test('applies numeric span classes per breakpoint', () => {
      const { container } = render(
        <CxCol className="bazinga" xs={1} sm={2} md={3} lg={4} xl={5} xxl={6}>
          Test
        </CxCol>
      )
      expect(container.firstChild).toHaveClass(
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
      const { container } = render(
        <CxCol xs={true} sm={true} md={true} lg={true} xl={true} xxl={true}>
          Test
        </CxCol>
      )
      expect(container.firstChild).toHaveClass(
        'col',
        'col-small',
        'col-medium',
        'col-large',
        'col-xlarge',
        'col-2xlarge'
      )
    })

    test('applies span/order/offset from a breakpoint object', () => {
      const { container } = render(<CxCol md={{ span: 6, order: 'first', offset: 2 }}>Test</CxCol>)
      expect(container.firstChild).toHaveClass(
        'medium:col-6',
        'medium:order-first',
        'medium:offset-2'
      )
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxCol ref={ref}>Test</CxCol>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCol>Test</CxCol>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

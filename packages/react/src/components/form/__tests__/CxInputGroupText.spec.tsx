import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxInputGroupText } from '../../../index'

describe('CxInputGroupText', () => {
  describe('rendering', () => {
    test('renders a span with the base class by default', () => {
      const { container } = render(<CxInputGroupText>Test</CxInputGroupText>)
      expect(container.firstChild).toHaveClass('input-addon')
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxInputGroupText>Test</CxInputGroupText>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      const { container } = render(
        <CxInputGroupText className="bazinga" component="label">
          Test
        </CxInputGroupText>
      )
      expect(container.firstChild).toHaveClass('input-addon', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('LABEL')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<CxInputGroupText ref={ref}>Test</CxInputGroupText>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxInputGroupText>Test</CxInputGroupText>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

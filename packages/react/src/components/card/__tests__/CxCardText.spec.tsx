import * as React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCardText } from '../../../index'

describe('CxCardText', () => {
  describe('rendering', () => {
    test('renders a p with the base class by default', () => {
      const { container } = render(<CxCardText>Test</CxCardText>)
      expect(container.firstChild).toHaveClass('card-text')
      expect(container.firstChild?.nodeName).toBe('P')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCardText>Test</CxCardText>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      const { container } = render(
        <CxCardText className="bazinga" component="h3">
          Test
        </CxCardText>
      )
      expect(container.firstChild).toHaveClass('card-text', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying paragraph', () => {
      const ref = React.createRef<HTMLParagraphElement>()
      render(<CxCardText ref={ref}>Test</CxCardText>)
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCardText>Test</CxCardText>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

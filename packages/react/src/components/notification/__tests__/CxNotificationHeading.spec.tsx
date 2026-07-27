import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxNotificationHeading } from '../../../index'

describe('CxNotificationHeading', () => {
  describe('rendering', () => {
    test('renders an h4 with the base class by default', () => {
      render(<CxNotificationHeading>Test</CxNotificationHeading>)
      const heading = screen.getByRole('heading', { level: 4, name: 'Test' })
      expect(heading).toHaveClass('notification-heading')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxNotificationHeading>Test</CxNotificationHeading>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CxNotificationHeading component="h3" className="bazinga">
          Test
        </CxNotificationHeading>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('notification-heading', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<CxNotificationHeading ref={ref}>Test</CxNotificationHeading>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxNotificationHeading>Test</CxNotificationHeading>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

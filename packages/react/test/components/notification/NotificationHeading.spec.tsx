import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { NotificationHeading } from '../../../src/index'

describe('NotificationHeading', () => {
  describe('rendering', () => {
    test('renders an h4 with the base class by default', () => {
      render(<NotificationHeading>Test</NotificationHeading>)
      const heading = screen.getByRole('heading', { level: 4, name: 'Test' })
      expect(heading).toHaveClass('notification-heading')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<NotificationHeading>Test</NotificationHeading>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <NotificationHeading component="h3" className="bazinga">
          Test
        </NotificationHeading>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('notification-heading', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<NotificationHeading ref={ref}>Test</NotificationHeading>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<NotificationHeading>Test</NotificationHeading>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

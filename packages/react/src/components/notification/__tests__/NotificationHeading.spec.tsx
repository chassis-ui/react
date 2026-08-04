import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Notification } from '../../../index'

describe('Notification.Heading', () => {
  describe('rendering', () => {
    test('renders an h4 with the base class by default', () => {
      render(<Notification.Heading>Test</Notification.Heading>)
      const heading = screen.getByRole('heading', { level: 4, name: 'Test' })
      expect(heading).toHaveClass('notification-heading')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Notification.Heading>Test</Notification.Heading>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <Notification.Heading component="h3" className="bazinga">
          Test
        </Notification.Heading>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('notification-heading', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<Notification.Heading ref={ref}>Test</Notification.Heading>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Notification.Heading>Test</Notification.Heading>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

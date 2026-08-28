import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { NotificationTitle } from '../../../src/index'

describe('NotificationTitle', () => {
  describe('rendering', () => {
    test('renders an h4 with the base class by default', () => {
      render(<NotificationTitle>Test</NotificationTitle>)
      const heading = screen.getByRole('heading', { level: 4, name: 'Test' })
      expect(heading).toHaveClass('notification-title')
    })

    test('renders as a custom component with className merged', () => {
      render(
        <NotificationTitle component="h3" className="bazinga">
          Test
        </NotificationTitle>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('notification-title', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<NotificationTitle ref={ref}>Test</NotificationTitle>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<NotificationTitle>Test</NotificationTitle>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

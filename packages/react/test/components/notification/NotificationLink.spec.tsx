import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { NotificationLink } from '../../../src/index'

describe('NotificationLink', () => {
  describe('rendering', () => {
    test('renders an anchor with the base class', () => {
      render(
        <NotificationLink className="bazinga" href="/bazinga">
          Test
        </NotificationLink>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('notification-link', 'bazinga')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<NotificationLink href="/bazinga">Test</NotificationLink>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying anchor', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <NotificationLink ref={ref} href="/bazinga">
          Test
        </NotificationLink>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<NotificationLink href="/bazinga">Test</NotificationLink>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

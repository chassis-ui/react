import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxNotificationLink } from '../../../index'

describe('CxNotificationLink', () => {
  describe('rendering', () => {
    test('renders an anchor with the base class', () => {
      render(
        <CxNotificationLink className="bazinga" href="/bazinga">
          Test
        </CxNotificationLink>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('notification-link', 'bazinga')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxNotificationLink href="/bazinga">Test</CxNotificationLink>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying anchor', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <CxNotificationLink ref={ref} href="/bazinga">
          Test
        </CxNotificationLink>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxNotificationLink href="/bazinga">Test</CxNotificationLink>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

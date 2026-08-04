import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Notification } from '../../../index'

describe('Notification.Link', () => {
  describe('rendering', () => {
    test('renders an anchor with the base class', () => {
      render(
        <Notification.Link className="bazinga" href="/bazinga">
          Test
        </Notification.Link>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('notification-link', 'bazinga')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Notification.Link href="/bazinga">Test</Notification.Link>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying anchor', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <Notification.Link ref={ref} href="/bazinga">
          Test
        </Notification.Link>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Notification.Link href="/bazinga">Test</Notification.Link>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

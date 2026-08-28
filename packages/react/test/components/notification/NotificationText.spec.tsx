import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { NotificationText } from '../../../src/index'

describe('NotificationText', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      render(<NotificationText>Test</NotificationText>)
      const text = screen.getByText('Test')
      expect(text).toHaveClass('notification-text')
      expect(text.tagName).toBe('DIV')
    })

    test('renders as a custom component with className merged', () => {
      render(
        <NotificationText className="bazinga" component="p">
          Test
        </NotificationText>
      )
      const text = screen.getByText('Test')
      expect(text).toHaveClass('notification-text', 'bazinga')
      expect(text.tagName).toBe('P')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<NotificationText ref={ref}>Test</NotificationText>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<NotificationText>Test</NotificationText>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

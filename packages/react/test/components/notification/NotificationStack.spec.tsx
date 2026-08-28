import React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import {
  Button,
  NotificationStack,
  NotificationTitle,
  addNotification,
  notificationQueue
} from '../../../src/index'

afterEach(() => {
  act(() => notificationQueue.clear())
})

describe('NotificationStack', () => {
  describe('rendering', () => {
    test('renders the region wrapper with its aria-label, top-layer marker, and tabindex', () => {
      render(<NotificationStack>Test</NotificationStack>)
      const region = screen.getByRole('region')
      expect(region).toHaveAttribute('aria-label', '0 notifications.')
      expect(region).toHaveAttribute('data-react-aria-top-layer', 'true')
      expect(region).toHaveAttribute('tabindex', '-1')
    })

    test('renders nothing when the queue is empty and there are no children', () => {
      const { container } = render(<NotificationStack />)
      expect(container).toBeEmptyDOMElement()
    })

    test('applies a custom className alongside the base classes', () => {
      render(
        <>
          <NotificationStack className="bazinga" />
          <Button onClick={() => addNotification('Saved!', { color: 'success' })}>Save</Button>
        </>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))
      const region = screen.getByRole('region')
      expect(region).toHaveClass('bazinga', 'vstack', 'gap-small')
      expect(screen.getAllByRole('status')).toHaveLength(1)
    })
  })

  describe('sending and dismissing notifications', () => {
    test('addNotification is callable from outside render (an event handler, not a push prop)', () => {
      render(<NotificationStack />)
      act(() => {
        addNotification('Saved!')
      })
      expect(screen.getAllByRole('status')).toHaveLength(1)
      expect(screen.getByText('Saved!')).toBeInTheDocument()
    })

    test('passes color/solid/role/dismissible through to the rendered Notification', () => {
      render(<NotificationStack />)
      act(() => {
        addNotification(<NotificationTitle>Uh oh</NotificationTitle>, {
          color: 'danger',
          role: 'alert'
        })
      })
      const notification = screen.getByRole('alert')
      expect(notification).toHaveClass('notification', 'danger')
    })

    test('closing a queued notification removes it from the stack', () => {
      vi.useFakeTimers()
      render(<NotificationStack />)
      act(() => {
        addNotification('Dismiss me', { dismissible: true })
      })
      expect(screen.getAllByRole('status')).toHaveLength(1)

      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      act(() => vi.runAllTimers())
      expect(screen.queryAllByRole('status')).toHaveLength(0)
      vi.useRealTimers()
    })

    test('shows the most recently added notification first by default', () => {
      render(<NotificationStack />)
      act(() => {
        addNotification('First')
        addNotification('Second')
      })
      const notifications = screen.getAllByRole('status')
      expect(notifications[0]).toHaveTextContent('Second')
      expect(notifications[1]).toHaveTextContent('First')
    })

    test('reverse shows notifications in chronological order instead', () => {
      render(<NotificationStack reverse />)
      act(() => {
        addNotification('First')
        addNotification('Second')
      })
      const notifications = screen.getAllByRole('status')
      expect(notifications[0]).toHaveTextContent('First')
      expect(notifications[1]).toHaveTextContent('Second')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with a notification showing', async () => {
      render(<NotificationStack />)
      act(() => {
        addNotification('Saved!', { dismissible: true })
      })
      expect(await axe(document.body)).toHaveNoViolations()
    })
  })
})

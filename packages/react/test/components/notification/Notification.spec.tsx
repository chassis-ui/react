import * as React from 'react'
import { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Notification, useNotification } from '../../../src/index'

describe('Notification', () => {
  describe('rendering', () => {
    test('renders a div with the base class and a status role by default', () => {
      render(<Notification color="primary">Test</Notification>)
      const notification = screen.getByRole('status')
      expect(notification).toHaveClass('notification', 'primary')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Notification color="primary">Test</Notification>)
      expect(container).toMatchSnapshot()
    })

    test('applies the solid style with className', () => {
      render(
        <Notification color="secondary" className="bazinga" solid>
          Test
        </Notification>
      )
      const notification = screen.getByRole('status')
      expect(notification).toHaveClass('solid', 'bazinga')
    })

    test('overrides the default role for urgent messages', () => {
      render(
        <Notification color="danger" role="alert">
          Test
        </Notification>
      )
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  describe('dismiss behavior', () => {
    test('renders a close button when dismissible and calls onClose on click', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      render(
        <Notification color="primary" dismissible onClose={onClose}>
          Test
        </Notification>
      )
      expect(onClose).toHaveBeenCalledTimes(0)
      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      act(() => vi.runAllTimers())
      expect(onClose).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    test('does not render a close button by default', () => {
      render(<Notification color="primary">Test</Notification>)
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })

    test('closeLabel overrides the dismiss button accessible name', () => {
      render(
        <Notification dismissible closeLabel="Kapat">
          Test
        </Notification>
      )
      expect(screen.getByRole('button', { name: 'Kapat' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })

    test('a plain button wired via useNotification closes the notification without dismissible', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const Actions = () => {
        const { close } = useNotification()
        return (
          <button type="button" onClick={close}>
            Dismiss
          </button>
        )
      }
      render(
        <Notification color="primary" onClose={onClose} actions={<Actions />}>
          Test
        </Notification>
      )
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
      act(() => vi.runAllTimers())
      expect(onClose).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })
  })

  describe('shorthand content', () => {
    test('icon renders a NotificationIcon when given a name', () => {
      render(<Notification icon="check-solid">Test</Notification>)
      // A decorative icon with no title renders `aria-hidden`, so it has no accessible query.
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('.notification-icon')).toBeInTheDocument()
    })

    test('icon aligns to the start of the block when a title is also set', () => {
      render(
        <Notification icon="check-solid" title="Done">
          Test
        </Notification>
      )
      // A decorative icon with no title renders `aria-hidden`, so it has no accessible query.
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('.notification-icon')).toHaveClass('align-self-start')
    })

    test('a custom icon node is rendered as-is, without automatic alignment', () => {
      render(
        <Notification icon={<span data-testid="custom-icon" />} title="Done">
          Test
        </Notification>
      )
      expect(screen.getByTestId('custom-icon')).not.toHaveClass('align-self-start')
    })

    test('title renders via NotificationTitle with the default h4 tag', () => {
      render(<Notification title="Well done!">Test</Notification>)
      const title = screen.getByText('Well done!')
      expect(title.tagName).toBe('H4')
      expect(title).toHaveClass('notification-title')
    })

    test('titleComponent overrides the rendered tag', () => {
      render(
        <Notification title="Well done!" titleComponent="p">
          Test
        </Notification>
      )
      expect(screen.getByText('Well done!').tagName).toBe('P')
    })

    test('text renders via a single NotificationText', () => {
      render(<Notification text="This is a message" />)
      const text = screen.getByText('This is a message')
      expect(text).toHaveClass('notification-text')
    })

    test('actions render as passed-through markup after the body content', () => {
      render(<Notification text="Message" actions={<button type="button">Undo</button>} />)
      expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
    })

    test('title and text wire up aria-labelledby/aria-describedby', () => {
      render(<Notification title="Well done!" text="This is a message" />)
      const notification = screen.getByRole('status')
      const titleId = notification.getAttribute('aria-labelledby')
      const textId = notification.getAttribute('aria-describedby')
      expect(titleId).toBeTruthy()
      expect(textId).toBeTruthy()
      expect(screen.getByText('Well done!')).toHaveAttribute('id', titleId as string)
      expect(screen.getByText('This is a message')).toHaveAttribute('id', textId as string)
    })

    test('does not set aria-describedby without a title', () => {
      render(<Notification text="This is a message" />)
      expect(screen.getByRole('status')).not.toHaveAttribute('aria-describedby')
    })
  })

  describe('auto-dismiss', () => {
    test('is not auto-dismissed by default', () => {
      vi.useFakeTimers()
      render(<Notification delay={100}>Test</Notification>)
      act(() => vi.advanceTimersByTime(5000))
      expect(screen.getByRole('status')).toBeInTheDocument()
      vi.useRealTimers()
    })

    test('autohide dismisses the notification after delay and fires onClose', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      render(
        <Notification autohide delay={1000} onClose={onClose}>
          Test
        </Notification>
      )
      act(() => vi.advanceTimersByTime(1000))
      act(() => vi.runAllTimers())
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      vi.useRealTimers()
    })

    test('pauses the autohide timer on hover and resumes on leave', () => {
      vi.useFakeTimers()
      render(
        <Notification autohide delay={1000}>
          Test
        </Notification>
      )
      const notification = screen.getByRole('status')
      fireEvent.mouseEnter(notification)
      act(() => vi.advanceTimersByTime(1000))
      expect(screen.getByRole('status')).toBeInTheDocument()

      fireEvent.mouseLeave(notification)
      act(() => vi.advanceTimersByTime(1000))
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      vi.useRealTimers()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Notification ref={ref}>Test</Notification>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <Notification color="primary" dismissible>
          Test
        </Notification>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

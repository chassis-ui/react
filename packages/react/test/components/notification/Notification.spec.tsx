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
      // The autohide timer only starts once the entrance transition finishes (150ms) — see
      // useDismissibleTransition's `entered` gating.
      act(() => vi.advanceTimersByTime(150))
      act(() => vi.advanceTimersByTime(1000))
      act(() => vi.runAllTimers())
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      vi.useRealTimers()
    })

    test('BUG-13 regression: the autohide timer only starts once the entrance transition finishes, not the instant it mounts', () => {
      vi.useFakeTimers()
      const setTimeoutSpy = vi.spyOn(window, 'setTimeout')
      render(
        <Notification autohide delay={1000}>
          Test
        </Notification>
      )
      const scheduledAutohide = () => setTimeoutSpy.mock.calls.some(([, ms]) => ms === 1000)

      // Immediately at mount, before the 150ms entrance transition finishes, the autohide
      // countdown must not have been scheduled yet — gating on `visible` alone (as before this
      // fix) would schedule it here instead.
      expect(scheduledAutohide()).toBe(false)

      act(() => vi.advanceTimersByTime(150))

      // Once the entrance transition finishes and `entered` flips true, the countdown is now
      // scheduled.
      expect(scheduledAutohide()).toBe(true)

      setTimeoutSpy.mockRestore()
      vi.useRealTimers()
    })

    test("a sibling notification mounting does not restart this notification's pending autohide timer", () => {
      // BUG-12 regression: `NotificationStack` re-renders every mounted notification whenever
      // the shared queue changes (a notification arriving or being dismissed), since
      // `useToastQueue` triggers one state update covering the whole list. A `close` callback
      // that isn't stable across re-renders (previously an unmemoized `() => setVisible(false)`
      // built fresh every render) would silently restart the autohide countdown of every
      // *other* visible notification too.
      vi.useFakeTimers()
      const onCloseA = vi.fn()
      function Wrapper() {
        const [showB, setShowB] = React.useState(false)
        return (
          <>
            <Notification autohide delay={1000} onClose={onCloseA}>
              A
            </Notification>
            {showB && <Notification autohide={false}>B</Notification>}
            <button type="button" onClick={() => setShowB(true)}>
              show b
            </button>
          </>
        )
      }
      render(<Wrapper />)

      // Let A's entrance transition finish so its autohide timer actually starts.
      act(() => vi.advanceTimersByTime(150))
      // Most of the way through A's 1000ms delay.
      act(() => vi.advanceTimersByTime(900))
      // Mounting sibling notification B re-renders Wrapper — and, with it, A — with unchanged
      // props.
      fireEvent.click(screen.getByText('show b'))
      // The remaining 100ms of A's delay, plus its exit transition.
      act(() => vi.advanceTimersByTime(100))
      act(() => vi.runAllTimers())

      expect(onCloseA).toHaveBeenCalledTimes(1)
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

  describe('show/hide transition', () => {
    test('mounting already visible (the queue-mount path) still reaches the settled state, and dismissing mid-transition still fires onClose', () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      render(
        <Notification color="primary" dismissible onClose={onClose}>
          Test
        </Notification>
      )
      // Reaches the fully-entered state without needing a rerender to trigger the transition.
      act(() => vi.advanceTimersByTime(150))
      expect(screen.getByRole('status')).toHaveClass('show')

      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      act(() => vi.runAllTimers())
      expect(onClose).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    test('carries both show and showing classes while entering, so the fade has an opacity state to animate from', () => {
      vi.useFakeTimers()
      const { rerender } = render(
        <Notification autohide={false} visible={false}>
          Test
        </Notification>
      )
      expect(screen.queryByRole('status')).not.toBeInTheDocument()

      rerender(
        <Notification autohide={false} visible={true}>
          Test
        </Notification>
      )
      const notification = screen.getByRole('status')
      expect(notification).toHaveClass('fade', 'show', 'showing')

      act(() => vi.advanceTimersByTime(150))
      expect(notification).toHaveClass('show')
      expect(notification).not.toHaveClass('showing')
      vi.useRealTimers()
    })

    test('carries both show and showing classes while exiting, before unmounting', () => {
      vi.useFakeTimers()
      const { rerender } = render(
        <Notification autohide={false} visible={true}>
          Test
        </Notification>
      )
      const notification = screen.getByRole('status')
      act(() => vi.advanceTimersByTime(150))
      expect(notification).toHaveClass('show')
      expect(notification).not.toHaveClass('showing')

      rerender(
        <Notification autohide={false} visible={false}>
          Test
        </Notification>
      )
      expect(notification).toHaveClass('show', 'showing')

      act(() => vi.advanceTimersByTime(150))
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      vi.useRealTimers()
    })

    test('fires onShow when the entrance transition starts', () => {
      vi.useFakeTimers()
      const onShow = vi.fn()
      render(
        <Notification autohide={false} onShow={onShow}>
          Test
        </Notification>
      )
      expect(onShow).toHaveBeenCalledTimes(1)
      act(() => vi.advanceTimersByTime(150))
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

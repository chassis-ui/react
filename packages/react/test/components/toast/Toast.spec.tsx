import * as React from 'react'
import { act } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Toast, ToastBody, ToastFooter, ToastHeader, useToast } from '../../../src/index'

describe('Toast', () => {
  // A safety net for the fake-timer tests below: if one fails an assertion before reaching its
  // own `vi.useRealTimers()`, fake timers would otherwise stay active and hang every later test.
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('styling props', () => {
    test('applies color, className and the default status role once shown', async () => {
      render(
        <Toast className="bazinga" autohide={false} color="warning" delay={100} visible={true}>
          Test
        </Toast>
      )
      const toast = await waitFor(() => {
        const el = screen.getByRole('status')
        expect(el).toHaveClass('show')
        expect(el).not.toHaveClass('showing')
        return el
      })
      expect(toast).toHaveClass('bazinga', 'warning', 'context', 'fade', 'toast')
    })

    test('applies solid/translucent classes and a custom role', async () => {
      render(
        <Toast color="warning" solid translucent visible={true} autohide={false} role="alert">
          Test
        </Toast>
      )
      const toast = await waitFor(() => {
        const el = screen.getByRole('alert')
        expect(el).toHaveClass('context')
        return el
      })
      expect(toast).toHaveClass('translucent', 'solid', 'warning')
    })
  })

  describe('dismiss behavior', () => {
    test('clicking the close button hides the toast and fires onClose', async () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const { container } = render(
        <Toast
          className="bazinga"
          autohide={false}
          color="warning"
          delay={100}
          visible={true}
          onClose={onClose}
        >
          <ToastHeader
            icon={
              <svg
                className="rounded me-2"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
              >
                <rect width="100%" height="100%" fill="#007aff"></rect>
              </svg>
            }
            time="7 min ago"
            closeButton
          >
            Chassis
          </ToastHeader>
          <ToastBody>Hello, world! This is a toast message.</ToastBody>
        </Toast>
      )
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })

      expect(onClose).toHaveBeenCalledTimes(0)
      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      act(() => vi.runAllTimers())
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(container).toBeEmptyDOMElement()
      vi.useRealTimers()
    })

    test('a plain button in the footer wired via useToast closes the toast', async () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const Footer = () => {
        const { close } = useToast()
        return (
          <ToastFooter>
            <button type="button" onClick={close}>
              Close
            </button>
          </ToastFooter>
        )
      }
      render(
        <Toast autohide={false} delay={100} visible={true} onClose={onClose}>
          <ToastBody>Hello, world! This is a toast message.</ToastBody>
          <Footer />
        </Toast>
      )
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })

      expect(onClose).toHaveBeenCalledTimes(0)
      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      act(() => vi.runAllTimers())
      expect(onClose).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    test('a button in a footer render function receives close directly, no useToast needed', async () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      render(
        <Toast
          autohide={false}
          delay={100}
          visible={true}
          onClose={onClose}
          footer={(close) => (
            <button type="button" onClick={close}>
              Close
            </button>
          )}
        >
          <ToastBody>Hello, world! This is a toast message.</ToastBody>
        </Toast>
      )
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })

      expect(onClose).toHaveBeenCalledTimes(0)
      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      act(() => vi.runAllTimers())
      expect(onClose).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })
  })

  describe('autohide behavior', () => {
    test('hides itself automatically after the delay', async () => {
      const { container } = render(
        <Toast autohide={true} delay={1000} visible={true}>
          Test
        </Toast>
      )

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })

      await waitFor(
        () => {
          expect(container).toBeEmptyDOMElement()
        },
        {
          timeout: 5000
        }
      )
    }, 10000)

    test('pauses autohide while focused', async () => {
      const { container } = render(
        <Toast autohide={true} delay={1000} visible={true}>
          <button type="button">Action</button>
        </Toast>
      )

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })

      const toast = screen.getByRole('status')
      fireEvent.focus(toast)

      // Would have autohidden by now (delay is 1000ms) if focus didn't pause the timer.
      // Wrapped in act because the show->entered transition's own real timer (~250ms) fires
      // during this wait and updates Transition/Toast state outside of any RTL query.
      await act(() => new Promise((resolve) => setTimeout(resolve, 1200)))
      expect(container).not.toBeEmptyDOMElement()

      fireEvent.blur(toast)

      await waitFor(
        () => {
          expect(container).toBeEmptyDOMElement()
        },
        {
          timeout: 5000
        }
      )
    }, 10000)

    test('turning autohide off mid-display cancels the pending hide, instead of hiding on the original schedule', async () => {
      const { rerender, container } = render(
        <Toast autohide delay={500} visible={true}>
          Test
        </Toast>
      )
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })

      rerender(
        <Toast autohide={false} delay={500} visible={true}>
          Test
        </Toast>
      )

      // Would have autohidden by now (delay is 500ms) if turning autohide off didn't cancel
      // the timer that was already pending from before the rerender. Wrapped in act because the
      // show->entered transition's own real timer (~250ms) fires during this wait and updates
      // Transition/Toast state outside of any RTL query.
      await act(() => new Promise((resolve) => setTimeout(resolve, 900)))
      expect(container).not.toBeEmptyDOMElement()
      expect(screen.getByRole('status')).toHaveClass('show')
    }, 10000)

    test("a sibling toast mounting does not restart this toast's pending autohide timer", () => {
      // BUG-12 regression: `Toaster` re-renders every mounted toast whenever the shared queue
      // changes (a toast arriving or being dismissed), since `useToastQueue` triggers one state
      // update covering the whole list. A `close` callback that isn't stable across re-renders
      // (previously an unmemoized `() => setVisible(false)` built fresh every render) would
      // silently restart the autohide countdown of every *other* visible toast too.
      vi.useFakeTimers()
      const onCloseA = vi.fn()
      function Wrapper() {
        const [showB, setShowB] = React.useState(false)
        return (
          <>
            <Toast autohide delay={1000} visible onClose={onCloseA}>
              A
            </Toast>
            {showB && (
              <Toast autohide={false} visible>
                B
              </Toast>
            )}
            <button type="button" onClick={() => setShowB(true)}>
              show b
            </button>
          </>
        )
      }
      render(<Wrapper />)

      // Let A's entrance transition finish so its autohide timer actually starts.
      act(() => vi.advanceTimersByTime(250))
      // Most of the way through A's 1000ms delay.
      act(() => vi.advanceTimersByTime(900))
      // Mounting sibling toast B re-renders Wrapper — and, with it, A — with unchanged props.
      fireEvent.click(screen.getByText('show b'))
      // The remaining 100ms of A's delay, plus its exit transition.
      act(() => vi.advanceTimersByTime(100))
      act(() => vi.runAllTimers())

      expect(onCloseA).toHaveBeenCalledTimes(1)
    })

    test('a delay change mid-display reschedules the hide against the new delay', async () => {
      const { rerender, container } = render(
        <Toast autohide delay={5000} visible={true}>
          Test
        </Toast>
      )
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })

      rerender(
        <Toast autohide delay={500} visible={true}>
          Test
        </Toast>
      )

      // Well under the original 5000ms delay — only reachable if the reschedule picked up the
      // new 500ms delay instead of keeping the stale 5000ms timer from before the rerender.
      await waitFor(
        () => {
          expect(container).toBeEmptyDOMElement()
        },
        { timeout: 3000 }
      )
    }, 10000)
  })

  describe('show/hide transition', () => {
    test('carries both show and showing classes while entering, so it stays laid out mid-transition', () => {
      vi.useFakeTimers()
      const { rerender } = render(
        <Toast autohide={false} visible={false}>
          Test
        </Toast>
      )
      expect(screen.queryByRole('status')).not.toBeInTheDocument()

      rerender(
        <Toast autohide={false} visible={true}>
          Test
        </Toast>
      )
      const toast = screen.getByRole('status')
      expect(toast).toHaveClass('show', 'showing')

      act(() => vi.advanceTimersByTime(250))
      expect(toast).toHaveClass('show')
      expect(toast).not.toHaveClass('showing')
      vi.useRealTimers()
    })

    test('carries both show and showing classes while exiting, before unmounting', () => {
      vi.useFakeTimers()
      const { rerender } = render(
        <Toast autohide={false} visible={true}>
          Test
        </Toast>
      )
      const toast = screen.getByRole('status')
      act(() => vi.advanceTimersByTime(250))
      expect(toast).toHaveClass('show')
      expect(toast).not.toHaveClass('showing')

      rerender(
        <Toast autohide={false} visible={false}>
          Test
        </Toast>
      )
      expect(toast).toHaveClass('show', 'showing')

      act(() => vi.advanceTimersByTime(250))
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      vi.useRealTimers()
    })

    test('mounting already visible (the queue-mount path) still plays the entrance transition', () => {
      vi.useFakeTimers()
      render(
        <Toast autohide={false} visible={true}>
          Test
        </Toast>
      )
      const toast = screen.getByRole('status')
      expect(toast).toHaveClass('show', 'showing')

      act(() => vi.advanceTimersByTime(250))
      expect(toast).toHaveClass('show')
      expect(toast).not.toHaveClass('showing')
      vi.useRealTimers()
    })

    test('fires onShow for a toast that mounts already visible, not just on a later prop flip', () => {
      vi.useFakeTimers()
      const onShow = vi.fn()
      render(
        <Toast autohide={false} visible={true} onShow={onShow}>
          Test
        </Toast>
      )
      expect(onShow).toHaveBeenCalledTimes(1)
      act(() => vi.advanceTimersByTime(250))
      expect(onShow).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })
  })

  describe('shorthand props', () => {
    test('composes header, body and footer from icon/title/time/message/footer', async () => {
      render(
        <Toast
          autohide={false}
          visible={true}
          icon={<svg data-testid="logo" />}
          title="Chassis"
          time="7 min ago"
          message="Hello, world!"
          footer={<button type="button">Take action</button>}
        >
          Test
        </Toast>
      )
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })
      expect(screen.getByTestId('logo')).toBeInTheDocument()
      expect(screen.getByText('Chassis')).toBeInTheDocument()
      expect(screen.getByText('7 min ago')).toBeInTheDocument()
      expect(screen.getByText('Hello, world!')).toBeInTheDocument()
      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Take action' })).toBeInTheDocument()
    })

    test('renders a header for closeButton alone, with no icon/title/time/message', async () => {
      render(
        <Toast autohide={false} visible={true} closeButton>
          Test
        </Toast>
      )
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })
      // `.toast-header`/`.toast-body` are plain layout divs with no accessible role, so there's
      // no query but a class selector to tell them apart structurally.
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('.toast-header')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    test('places closeButton in the body instead of a bare header when message is set but icon/title/time are not', async () => {
      render(<Toast autohide={false} visible={true} message="Hello, world!" closeButton />)
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('.toast-header')).not.toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      const body = document.querySelector('.toast-body')
      expect(body).toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByRole('button', { name: 'Close' }).closest('.toast-body')).toBe(body)
    })

    test('keeps closeButton in the header when icon/title/time is set alongside message', async () => {
      render(
        <Toast
          autohide={false}
          visible={true}
          title="Chassis"
          message="Hello, world!"
          closeButton
        />
      )
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })

      expect(
        // eslint-disable-next-line testing-library/no-node-access
        screen.getByRole('button', { name: 'Close' }).closest('.toast-header')
      ).toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('.toast-body .close-button')).not.toBeInTheDocument()
    })

    test('closeLabel overrides the shorthand close button accessible name', async () => {
      render(
        <Toast autohide={false} visible={true} title="Chassis" closeButton closeLabel="Fermer">
          Test
        </Toast>
      )
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })
      expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    })

    test('wires aria-labelledby/aria-describedby when title and message are both set', async () => {
      render(
        <Toast autohide={false} visible={true} title="Chassis" message="Hello, world!">
          Test
        </Toast>
      )
      const toast = await waitFor(() => {
        const el = screen.getByRole('status')
        expect(el).toHaveClass('show')
        return el
      })
      const labelledby = toast.getAttribute('aria-labelledby')
      const describedby = toast.getAttribute('aria-describedby')
      expect(labelledby).toBeTruthy()
      expect(describedby).toBeTruthy()
      expect(screen.getByText('Chassis')).toHaveAttribute('id', labelledby as string)
      expect(screen.getByText('Hello, world!')).toHaveAttribute('id', describedby as string)
    })

    test('does not set aria-describedby when only title is set', async () => {
      render(
        <Toast autohide={false} visible={true} title="Chassis">
          Test
        </Toast>
      )
      const toast = await waitFor(() => {
        const el = screen.getByRole('status')
        expect(el).toHaveClass('show')
        return el
      })
      expect(toast).toHaveAttribute('aria-labelledby')
      expect(toast).not.toHaveAttribute('aria-describedby')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations once shown', async () => {
      const { container } = render(
        <Toast autohide={false} color="warning" visible={true}>
          <ToastHeader time="7 min ago" closeButton>
            Chassis
          </ToastHeader>
          <ToastBody>Hello, world! This is a toast message.</ToastBody>
        </Toast>
      )
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations with shorthand props (icon/title/time/message/footer)', async () => {
      const { container } = render(
        <Toast
          autohide={false}
          color="warning"
          visible={true}
          icon={<svg aria-hidden="true" width="20" height="20" />}
          title="Chassis"
          time="7 min ago"
          message="Hello, world! This is a toast message."
          footer={
            <button type="button" className="button primary small">
              Take action
            </button>
          }
          closeButton
        />
      )
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

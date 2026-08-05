import * as React from 'react'
import { act } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Toast, ToastBody, ToastHeader } from '../../../index'

describe('Toast', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Toast>Test</Toast>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('styling props', () => {
    test('applies color, className and the default status role once shown', async () => {
      const { container } = render(
        <Toast className="bazinga" autohide={false} color="warning" delay={100} visible={true}>
          Test
        </Toast>
      )
      const toast = await waitFor(() => {
        const el = screen.getByRole('status')
        expect(el).toHaveClass('show')
        return el
      })
      expect(toast).toHaveClass('bazinga', 'warning', 'context', 'fade', 'toast')
      expect(container).toMatchSnapshot()
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
          <ToastHeader closeButton>
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
            <strong className="me-auto">Chassis</strong>
            <small>7 min ago</small>
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
      await new Promise((resolve) => setTimeout(resolve, 1200))
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
  })

  describe('accessibility', () => {
    test('has no axe violations once shown', async () => {
      const { container } = render(
        <Toast autohide={false} color="warning" visible={true}>
          <ToastHeader closeButton>
            <strong className="me-auto">Chassis</strong>
            <small>7 min ago</small>
          </ToastHeader>
          <ToastBody>Hello, world! This is a toast message.</ToastBody>
        </Toast>
      )
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveClass('show')
      })
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

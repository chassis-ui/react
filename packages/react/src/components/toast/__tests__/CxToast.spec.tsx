import * as React from 'react'
import { act } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { CxToast, CxToastBody, CxToastHeader } from '../../../index'

describe('CxToast', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxToast>Test</CxToast>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('styling props', () => {
    test('applies context, className and the default status role once shown', async () => {
      const { container } = render(
        <CxToast className="bazinga" autohide={false} context="warning" delay={100} visible={true}>
          Test
        </CxToast>
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
        <CxToast context="warning" solid translucent visible={true} autohide={false} role="alert">
          Test
        </CxToast>
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
        <CxToast
          className="bazinga"
          autohide={false}
          context="warning"
          delay={100}
          visible={true}
          onClose={onClose}
        >
          <CxToastHeader closeButton>
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
          </CxToastHeader>
          <CxToastBody>Hello, world! This is a toast message.</CxToastBody>
        </CxToast>
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
        <CxToast autohide={true} delay={1000} visible={true}>
          Test
        </CxToast>
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
        <CxToast autohide={true} delay={1000} visible={true}>
          <button type="button">Action</button>
        </CxToast>
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
})

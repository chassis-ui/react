import React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import {
  ToastBody,
  ToastHeader,
  Toaster,
  Button,
  addToast,
  toastQueue
} from '../../../src/index'

afterEach(() => {
  act(() => toastQueue.clear())
})

describe('Toaster', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Toaster>Test</Toaster>)
      expect(container).toMatchSnapshot()
    })

    test('renders nothing when the queue is empty and there are no children', () => {
      const { container } = render(<Toaster />)
      expect(container).toBeEmptyDOMElement()
    })

    test('applies a custom className alongside the base classes', () => {
      vi.useFakeTimers()
      render(
        <>
          <Toaster className="bazinga" />
          <Button
            onClick={() =>
              addToast(
                <>
                  <ToastHeader closeButton>Lorem ipsum</ToastHeader>
                  <ToastBody>Hello, world! This is a toast message.</ToastBody>
                </>,
                { autohide: false }
              )
            }
          >
            Send a toast
          </Button>
        </>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Send a toast' }))
      act(() => vi.runAllTimers())
      const region = screen.getByRole('region')
      expect(region).toHaveClass('bazinga', 'toaster', 'toast-container')
      expect(screen.getAllByRole('status')).toHaveLength(1)
      vi.useRealTimers()
    })
  })

  describe('sending and dismissing toasts', () => {
    test('addToast is callable from outside render (an event handler, not a push prop)', () => {
      vi.useFakeTimers()
      render(<Toaster />)
      act(() => {
        addToast('Saved!', { autohide: false })
      })
      act(() => vi.runAllTimers())
      expect(screen.getAllByRole('status')).toHaveLength(1)
      expect(screen.getByText('Saved!')).toBeInTheDocument()
      vi.useRealTimers()
    })

    test('closing a queued toast removes it from the toaster', () => {
      vi.useFakeTimers()
      render(<Toaster />)
      act(() => {
        addToast(<ToastHeader closeButton>Dismiss me</ToastHeader>, { autohide: false })
      })
      act(() => vi.runAllTimers())
      expect(screen.getAllByRole('status')).toHaveLength(1)

      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      act(() => vi.runAllTimers())
      expect(screen.queryAllByRole('status')).toHaveLength(0)
      vi.useRealTimers()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with a toast showing', async () => {
      vi.useFakeTimers()
      render(<Toaster />)
      act(() => {
        addToast(
          <>
            <ToastHeader closeButton>Lorem ipsum</ToastHeader>
            <ToastBody>Hello, world! This is a toast message.</ToastBody>
          </>,
          { autohide: false }
        )
      })
      act(() => vi.runAllTimers())
      vi.useRealTimers()
      expect(await axe(document.body)).toHaveNoViolations()
    })
  })
})

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

    test.each([
      ['top-start', ['position-fixed', 'top-0', 'start-0']],
      ['top-center', ['position-fixed', 'top-0', 'start-50', 'translate-middle-x']],
      ['top-end', ['position-fixed', 'top-0', 'end-0']],
      ['middle-start', ['position-fixed', 'top-50', 'translate-middle-y', 'start-0']],
      [
        'middle-center',
        ['position-fixed', 'top-50', 'translate-middle-y', 'start-50', 'translate-middle-x']
      ],
      ['middle-end', ['position-fixed', 'top-50', 'translate-middle-y', 'end-0']],
      ['bottom-start', ['position-fixed', 'bottom-0', 'start-0']],
      ['bottom-center', ['position-fixed', 'bottom-0', 'start-50', 'translate-middle-x']],
      ['bottom-end', ['position-fixed', 'bottom-0', 'end-0']]
    ])('placement="%s" applies %j', (placement, expectedClasses) => {
      render(<Toaster placement={placement}>Test</Toaster>)
      const region = document.body.querySelector('.toaster') as HTMLElement
      expect(region).toHaveClass(...expectedClasses)
    })

    test('renders as a static (non-portaled) container without a placement', () => {
      const { container } = render(<Toaster>Test</Toaster>)
      const region = container.querySelector('.toaster') as HTMLElement
      expect(region).toHaveClass('position-static')
      expect(region).not.toHaveClass('position-fixed')
    })

    test('a custom placement string only applies position-fixed, no alignment classes', () => {
      render(<Toaster placement="custom-corner">Test</Toaster>)
      const region = document.body.querySelector('.toaster') as HTMLElement
      expect(region).toHaveClass('position-fixed')
      expect(region.className).not.toMatch(/\btop-0\b|\bbottom-0\b|\bstart-0\b|\bend-0\b|translate-middle/)
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

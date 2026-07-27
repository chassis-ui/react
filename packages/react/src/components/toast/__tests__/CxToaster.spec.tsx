import React from 'react'
import { act, render, fireEvent } from '@testing-library/react'

import {
  CxToaster,
  CxToastBody,
  CxToastHeader,
  CxButton,
  addToast,
  toastQueue
} from '../../../index'

afterEach(() => {
  act(() => toastQueue.clear())
})

test('loads and displays CxToaster component', async () => {
  const { container } = render(<CxToaster>Test</CxToaster>)
  expect(container).toMatchSnapshot()
})

test('renders nothing when the queue is empty and there are no children', async () => {
  const { container } = render(<CxToaster />)
  expect(container.firstChild).toBeNull()
})

test('CxToaster customize', async () => {
  jest.useFakeTimers()
  const { container } = render(
    <>
      <CxToaster className="bazinga" />
      <CxButton
        onClick={() =>
          addToast(
            <>
              <CxToastHeader closeButton>Lorem ipsum</CxToastHeader>
              <CxToastBody>Hello, world! This is a toast message.</CxToastBody>
            </>,
            { autohide: false }
          )
        }
      >
        Send a toast
      </CxButton>
    </>
  )
  const btn = document.querySelector('.button')
  act(() => {
    if (btn !== null) {
      fireEvent.click(btn)
    }
  })
  act(() => jest.runAllTimers())
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('toaster')
  expect(container.firstChild).toHaveClass('toast-container')
  expect(document.body.getElementsByClassName('toast').length).toBe(1)
  jest.useRealTimers()
})

test('addToast is callable from outside render (an event handler, not a push prop)', async () => {
  jest.useFakeTimers()
  render(<CxToaster />)
  act(() => {
    addToast('Saved!', { autohide: false })
  })
  act(() => jest.runAllTimers())
  expect(document.body.getElementsByClassName('toast').length).toBe(1)
  expect(document.body.textContent).toContain('Saved!')
  jest.useRealTimers()
})

test('closing a queued toast removes it from the toaster', async () => {
  jest.useFakeTimers()
  render(<CxToaster />)
  act(() => {
    addToast(<CxToastHeader closeButton>Dismiss me</CxToastHeader>, { autohide: false })
  })
  act(() => jest.runAllTimers())
  expect(document.body.getElementsByClassName('toast').length).toBe(1)

  const closeBtn = document.querySelector('.close-button')
  act(() => {
    if (closeBtn !== null) fireEvent.click(closeBtn)
  })
  act(() => jest.runAllTimers())
  expect(document.body.getElementsByClassName('toast').length).toBe(0)
  jest.useRealTimers()
})

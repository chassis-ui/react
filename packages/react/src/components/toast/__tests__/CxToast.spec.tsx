import * as React from 'react'
import { act } from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

import { CxToast, CxToastBody, CxToastHeader } from '../../../index'

test('loads and displays CxToast component', async () => {
  const { container } = render(<CxToast>Test</CxToast>)
  expect(container).toMatchSnapshot()
})

test('CxToast customize', async () => {
  const { container } = render(
    <CxToast
      className="bazinga"
      autohide={false}
      context="warning"
      delay={100}
      visible={true}
      //onClose
    >
      Test
    </CxToast>,
  )
  await waitFor(() => {
    expect(container).toMatchSnapshot()
    expect(container.firstChild).toHaveClass('bazinga')
    expect(container.firstChild).toHaveClass('toast')
    expect(container.firstChild).toHaveClass('fade')
    expect(container.firstChild).toHaveClass('bg-warning')
    expect(container.firstChild).toHaveClass('show')
  })
})

test('CxToast click on dismiss button', async () => {
  jest.useFakeTimers()
  const onClose = jest.fn()
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
        <strong className="me-auto">Bootstrap React</strong>
        <small>7 min ago</small>
      </CxToastHeader>
      <CxToastBody>Hello, world! This is a toast message.</CxToastBody>
    </CxToast>,
  )
  await waitFor(() => {
    expect(container.firstChild).toHaveClass('show')
  })

  expect(onClose).toHaveBeenCalledTimes(0)
  const btn = document.querySelector('.close-button')
  if (btn !== null) {
    fireEvent.click(btn)
  }
  act(() => jest.runAllTimers())
  expect(onClose).toHaveBeenCalledTimes(1)
  expect(container.firstChild).toBeNull()
  jest.useRealTimers()
})

test('CxToast test autohide', async () => {
  const { container } = render(
    <CxToast autohide={true} delay={1000} visible={true}>
      Test
    </CxToast>,
  )

  await waitFor(() => {
    expect(container.firstChild).toHaveClass('show')
  })

  await waitFor(
    () => {
      expect(container.firstChild).toBeNull()
    },
    {
      timeout: 5000,
    },
  )
})

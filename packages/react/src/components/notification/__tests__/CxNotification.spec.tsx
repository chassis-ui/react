import * as React from 'react'
import { act } from 'react'
import { render, fireEvent } from '@testing-library/react'

import { CxNotification } from '../../../index'

test('loads and displays CxNotification component', async () => {
  const { container } = render(<CxNotification context="primary">Test</CxNotification>)
  expect(container).toMatchSnapshot()
})

test('CxNotification customize', async () => {
  const { container } = render(
    <CxNotification
      context="secondary"
      className="bazinga"
      dismissible={true}
      variant="solid"
      visible={true}
    >
      Test
    </CxNotification>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('bg-secondary')
  expect(container.firstChild).toHaveClass('fg-white')
})

test('CxNotification click close button', async () => {
  jest.useFakeTimers()
  const onClose = jest.fn()
  render(
    <CxNotification context="primary" dismissible onClose={onClose}>
      Test
    </CxNotification>,
  )
  expect(onClose).toHaveBeenCalledTimes(0)
  const btn = document.querySelector('.close-button')
  if (btn !== null) {
    fireEvent.click(btn)
  }
  expect(onClose).toHaveBeenCalledTimes(1)
  act(() => jest.runAllTimers())
  expect(onClose).toHaveBeenCalledTimes(1)
  jest.useRealTimers()
})

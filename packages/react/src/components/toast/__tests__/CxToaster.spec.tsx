import React from 'react' //  useState,
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxToast, CxToaster, CxToastBody, CxToastHeader, CxButton } from '../../../index'

test('loads and displays CxToaster component', async () => {
  const { container } = render(<CxToaster>Test</CxToaster>)
  expect(container).toMatchSnapshot()
})

test('CxToaster customize', async () => {
  jest.useFakeTimers()
  let toast = <></>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addToast = function (t: any) {
    toast = t
  }
  const { container } = render(
    <>
      <CxToaster push={toast} className="bazinga" />
      <CxButton
        onClick={() =>
          addToast(
            <>
              <CxToast autohide={false}>
                <CxToastHeader closeButton>Lorem ipsum</CxToastHeader>
                <CxToastBody>Hello, world! This is a toast message.</CxToastBody>
              </CxToast>
            </>,
          )
        }
      >
        Send a toast
      </CxButton>
    </>,
  )
  expect(container).toMatchSnapshot()
  const btn = document.querySelector('.button')
  if (btn !== null) {
    fireEvent.click(btn)
  }
  jest.runAllTimers()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('toaster')
  expect(container.firstChild).toHaveClass('toast-container')
  jest.useRealTimers()
})

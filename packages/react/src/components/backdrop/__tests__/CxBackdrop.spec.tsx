import * as React from 'react'
import { render } from '@testing-library/react'

import { CxBackdrop } from '../../../index'

test('loads and displays CxBackdrop component', async () => {
  const { container } = render(<CxBackdrop>Test</CxBackdrop>)
  expect(container).toMatchSnapshot()
})

test('CxBackdrop customize', async () => {
  jest.useFakeTimers()
  const { container } = render(<CxBackdrop visible={true}>Test</CxBackdrop>)
  jest.runAllTimers()
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('modal-backdrop')
  jest.useRealTimers()
})

test('CxBackdrop customize 2', async () => {
  jest.useFakeTimers()
  const { container } = render(
    <CxBackdrop className="bazinga" visible={true}>
      Test
    </CxBackdrop>
  )
  jest.runAllTimers()
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  jest.useRealTimers()
})

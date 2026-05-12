import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxModalHeader } from '../../../index'

test('loads and displays CxModalHeader component', async () => {
  const { container } = render(<CxModalHeader>Test</CxModalHeader>)
  expect(container).toMatchSnapshot()
})

test('CxModalHeader customize', async () => {
  const { container } = render(<CxModalHeader className="bazinga">Test</CxModalHeader>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('modal-header')
})

test('CxModalHeader has a close button', async () => {
  const onDismiss = jest.fn()
  render(<CxModalHeader className="bazinga">Test</CxModalHeader>)
  expect(onDismiss).toHaveBeenCalledTimes(0)
  const btn = document.querySelector('.close-button')
  expect(btn).toBeTruthy()
})

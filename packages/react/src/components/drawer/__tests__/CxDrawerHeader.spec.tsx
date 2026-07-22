import * as React from 'react'
import { render } from '@testing-library/react'

import { CxDrawerHeader } from '../../../index'

test('loads and displays CxDrawerHeader component', async () => {
  const { container } = render(<CxDrawerHeader>Test</CxDrawerHeader>)
  expect(container).toMatchSnapshot()
})

test('CxDrawerHeader customize', async () => {
  const { container } = render(<CxDrawerHeader className="bazinga">Test</CxDrawerHeader>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('drawer-header')
})

test('CxDrawerHeader has a close button', async () => {
  render(<CxDrawerHeader className="bazinga">Test</CxDrawerHeader>)
  const btn = document.querySelector('.close-button')
  expect(btn).toBeTruthy()
})

test('CxDrawerHeader can hide the close button', async () => {
  render(<CxDrawerHeader closeButton={false}>Test</CxDrawerHeader>)
  const btn = document.querySelector('.close-button')
  expect(btn).toBeFalsy()
})

import * as React from 'react'
import { render } from '@testing-library/react'

import { CxNavbarToggler } from '../../../index'

test('CxNavbarToggler witch children', async () => {
  const { container } = render(<CxNavbarToggler>Test</CxNavbarToggler>)
  expect(container).toMatchSnapshot()
})

test('CxNavbarToggler witch no children', async () => {
  const { container } = render(<CxNavbarToggler />)
  expect(container).toMatchSnapshot()
  const arrLength = container.getElementsByClassName('navbar-toggler-icon').length
  expect(arrLength).toBe(1)
})

test('CxNavbarToggler customize', async () => {
  const { container } = render(<CxNavbarToggler className="bazinga" />)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('navbar-toggler')
})

import * as React from 'react'
import { render } from '@testing-library/react'

import { CxNavbar } from '../../../index'

test('loads and displays CxNavbar component', async () => {
  const { container } = render(<CxNavbar>Test</CxNavbar>)
  expect(container).toMatchSnapshot()
})

test('CxNavbar customize', async () => {
  const { container } = render(
    <CxNavbar
      className="bazinga"
      context="warning"
      colorScheme="dark"
      component="h3"
      container="xlarge"
      expand="large"
      placement="fixed-bottom"
    >
      Test
    </CxNavbar>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('navbar')
  expect(container.firstChild).toHaveClass('bg-warning')
  expect(container.firstChild).toHaveClass('navbar-dark')
  expect(container.firstChild).toHaveClass('navbar-expand-large')
  expect(container.firstChild).toHaveClass('fixed-bottom')
  const arrLength = container.getElementsByClassName('container-xlarge').length
  expect(arrLength).toBe(1)
})

test('CxNavbar customize - container and expand are boolean', async () => {
  const { container } = render(
    <CxNavbar container={true} expand={true}>
      Test
    </CxNavbar>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('navbar-expand')
  const arrLength = container.getElementsByClassName('container').length
  expect(arrLength).toBe(1)
})

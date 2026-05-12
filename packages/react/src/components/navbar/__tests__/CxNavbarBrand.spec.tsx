import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxNavbarBrand } from '../../../index'

test('loads and displays CxNavbarBrand component', async () => {
  const { container } = render(<CxNavbarBrand>Test</CxNavbarBrand>)
  expect(container).toMatchSnapshot()
})

test('CxNavbarBrand witch href', async () => {
  const { container } = render(<CxNavbarBrand href="/bazinga">Test</CxNavbarBrand>)
  expect(container).toMatchSnapshot()
})

test('CxNavbarBrand customize', async () => {
  const { container } = render(
    <CxNavbarBrand className="bazinga" component="h3" href="/bazinga">
      Test
    </CxNavbarBrand>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('navbar-brand')
  expect(container.firstChild).toHaveClass('bazinga')
})

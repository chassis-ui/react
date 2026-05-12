import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxOffcanvasHeader } from '../../../index'

test('loads and displays CxOffcanvasHeader component', async () => {
  const { container } = render(<CxOffcanvasHeader />)
  expect(container).toMatchSnapshot()
})

test('CxOffcanvasHeader customize', async () => {
  const { container } = render(<CxOffcanvasHeader className="bazinga">Test</CxOffcanvasHeader>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('offcanvas-header')
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveTextContent('Test')
})

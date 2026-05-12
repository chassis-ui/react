import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxOffcanvasBody } from '../../../index'

test('loads and displays CxOffcanvasBody component', async () => {
  const { container } = render(<CxOffcanvasBody />)
  expect(container).toMatchSnapshot()
})

test('CxOffcanvasBody customize', async () => {
  const { container } = render(<CxOffcanvasBody className="bazinga">Test</CxOffcanvasBody>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('offcanvas-body')
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveTextContent('Test')
})

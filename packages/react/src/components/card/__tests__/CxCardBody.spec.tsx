import * as React from 'react'
import { render } from '@testing-library/react'

import { CxCardBody } from '../../../index'

test('loads and displays CxCardBody component', async () => {
  const { container } = render(<CxCardBody>Test</CxCardBody>)
  expect(container).toMatchSnapshot()
})

test('CxCardBody customize', async () => {
  const { container } = render(<CxCardBody className="bazinga">Test</CxCardBody>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('card-body')
})

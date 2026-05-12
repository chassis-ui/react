import * as React from 'react'
import { render } from '@testing-library/react'

import { CxModalBody } from '../../../index'

test('loads and displays CxModalBody component', async () => {
  const { container } = render(<CxModalBody>Test</CxModalBody>)
  expect(container).toMatchSnapshot()
})

test('CxModalBody customize', async () => {
  const { container } = render(<CxModalBody className="bazinga">Test</CxModalBody>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('modal-body')
})

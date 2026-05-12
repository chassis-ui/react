import * as React from 'react'
import { render } from '@testing-library/react'

import { CxToastBody } from '../../../index'

test('loads and displays CxToastBody component', async () => {
  const { container } = render(<CxToastBody>Test</CxToastBody>)
  expect(container).toMatchSnapshot()
})

test('CxToastBody customize', async () => {
  const { container } = render(<CxToastBody className="bazinga">Test</CxToastBody>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('toast-body')
})

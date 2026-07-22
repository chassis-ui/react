import * as React from 'react'
import { render } from '@testing-library/react'

import { CxDrawerBody } from '../../../index'

test('loads and displays CxDrawerBody component', async () => {
  const { container } = render(<CxDrawerBody>Test</CxDrawerBody>)
  expect(container).toMatchSnapshot()
})

test('CxDrawerBody customize', async () => {
  const { container } = render(<CxDrawerBody className="bazinga">Test</CxDrawerBody>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('drawer-body')
})

import * as React from 'react'
import { render } from '@testing-library/react'

import { CxDrawerFooter } from '../../../index'

test('loads and displays CxDrawerFooter component', async () => {
  const { container } = render(<CxDrawerFooter>Test</CxDrawerFooter>)
  expect(container).toMatchSnapshot()
})

test('CxDrawerFooter customize', async () => {
  const { container } = render(<CxDrawerFooter className="bazinga">Test</CxDrawerFooter>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('drawer-footer')
})

test('CxDrawerFooter stacked', async () => {
  const { container } = render(<CxDrawerFooter stacked>Test</CxDrawerFooter>)
  expect(container.firstChild).toHaveClass('drawer-footer')
  expect(container.firstChild).toHaveClass('stacked')
})

import * as React from 'react'
import { render } from '@testing-library/react'

import { CxModalFooter } from '../../../index'

test('loads and displays CxModalFooter component', async () => {
  const { container } = render(<CxModalFooter>Test</CxModalFooter>)
  expect(container).toMatchSnapshot()
})

test('CxModalFooter customize', async () => {
  const { container } = render(<CxModalFooter className="bazinga">Test</CxModalFooter>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('modal-footer')
})

test('CxModalFooter stacked', async () => {
  const { container } = render(<CxModalFooter stacked>Test</CxModalFooter>)
  expect(container.firstChild).toHaveClass('modal-footer')
  expect(container.firstChild).toHaveClass('stacked')
})

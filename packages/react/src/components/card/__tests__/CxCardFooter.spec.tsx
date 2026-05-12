import * as React from 'react'
import { render } from '@testing-library/react'

import { CxCardFooter } from '../../../index'

test('loads and displays CxCardFooter component', async () => {
  const { container } = render(<CxCardFooter>Test</CxCardFooter>)
  expect(container).toMatchSnapshot()
})

test('CxCardFooter customize', async () => {
  const { container } = render(<CxCardFooter className="bazinga">Test</CxCardFooter>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('card-footer')
})

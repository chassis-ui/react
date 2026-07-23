import * as React from 'react'
import { render } from '@testing-library/react'

import { CxToastFooter } from '../../../index'

test('loads and displays CxToastFooter component', async () => {
  const { container } = render(<CxToastFooter>Test</CxToastFooter>)
  expect(container).toMatchSnapshot()
})

test('CxToastFooter customize', async () => {
  const { container } = render(<CxToastFooter className="bazinga">Test</CxToastFooter>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('toast-footer')
})

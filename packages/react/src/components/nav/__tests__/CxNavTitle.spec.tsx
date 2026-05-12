import * as React from 'react'
import { render } from '@testing-library/react'

import { CxNavTitle } from '../../../index'

test('loads and displays CxNavTitle component', async () => {
  const { container } = render(<CxNavTitle>Test</CxNavTitle>)
  expect(container).toMatchSnapshot()
})

test('CxNavTitle customize', async () => {
  const { container } = render(<CxNavTitle className="bazinga">Test</CxNavTitle>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('nav-title')
  expect(container.firstChild).toHaveClass('bazinga')
})

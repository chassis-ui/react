import * as React from 'react'
import { render } from '@testing-library/react'

import { CxCardHeader } from '../../../index'

test('loads and displays CxCardHeader component', async () => {
  const { container } = render(<CxCardHeader>Test</CxCardHeader>)
  expect(container).toMatchSnapshot()
})

test('CxCardHeader customize', async () => {
  const { container } = render(
    <CxCardHeader className="bazinga" component="h3">
      Test
    </CxCardHeader>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('card-header')
})

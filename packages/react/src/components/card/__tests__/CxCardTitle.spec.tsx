import * as React from 'react'
import { render } from '@testing-library/react'

import { CxCardTitle } from '../../../index'

test('loads and displays CxCardTitle component', async () => {
  const { container } = render(<CxCardTitle>Test</CxCardTitle>)
  expect(container).toMatchSnapshot()
})

test('CxCardTitle customize', async () => {
  const { container } = render(
    <CxCardTitle className="bazinga" component="h3">
      Test
    </CxCardTitle>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('card-title')
})

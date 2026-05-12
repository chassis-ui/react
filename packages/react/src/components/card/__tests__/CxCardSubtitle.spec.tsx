import * as React from 'react'
import { render } from '@testing-library/react'

import { CxCardSubtitle } from '../../../index'

test('loads and displays CxCardSubtitle component', async () => {
  const { container } = render(<CxCardSubtitle>Test</CxCardSubtitle>)
  expect(container).toMatchSnapshot()
})

test('CxCardSubtitle customize', async () => {
  const { container } = render(
    <CxCardSubtitle className="bazinga" component="h3">
      Test
    </CxCardSubtitle>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('card-subtitle')
})

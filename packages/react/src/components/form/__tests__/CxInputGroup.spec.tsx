import * as React from 'react'
import { render } from '@testing-library/react'

import { CxInputGroup } from '../../../index'

test('loads and displays CxInputGroup component', async () => {
  const { container } = render(<CxInputGroup>Test</CxInputGroup>)
  expect(container).toMatchSnapshot()
})

test('CxInputGroup customize', async () => {
  const { container } = render(
    <CxInputGroup className="bazinga" size="large">
      Test
    </CxInputGroup>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('input-group')
  expect(container.firstChild).toHaveClass('input-group-large')
})

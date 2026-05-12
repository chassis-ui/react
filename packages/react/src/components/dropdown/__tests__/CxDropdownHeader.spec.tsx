import * as React from 'react'
import { render } from '@testing-library/react'

import { CxDropdownHeader } from '../../../index'

test('loads and displays CxDropdownHeader component', async () => {
  const { container } = render(<CxDropdownHeader>Test</CxDropdownHeader>)
  expect(container).toMatchSnapshot()
})

test('CxDropdownHeader customize', async () => {
  const { container } = render(
    <CxDropdownHeader className="bazinga" component="h3">
      Test
    </CxDropdownHeader>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('dropdown-header')
})

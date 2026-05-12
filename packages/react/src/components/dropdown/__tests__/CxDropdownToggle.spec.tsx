import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxDropdownToggle } from '../../../index'

test('loads and displays CxDropdownToggle component', async () => {
  const { container } = render(<CxDropdownToggle>Test</CxDropdownToggle>)
  expect(container).toMatchSnapshot()
})

test('CxDropdownToggle customize', async () => {
  const { container } = render(
    <CxDropdownToggle caret={true} split={true} trigger="focus">
      Test
    </CxDropdownToggle>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('dropdown-toggle')
  expect(container.firstChild).toHaveClass('dropdown-toggle-split')
})

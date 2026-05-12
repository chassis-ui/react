import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxDropdownItem } from '../../../index'

test('loads and displays CxDropdownItem component', async () => {
  const { container } = render(<CxDropdownItem>Test</CxDropdownItem>)
  expect(container).toMatchSnapshot()
})

test('CxDropdownItem customize', async () => {
  const { container } = render(
    <CxDropdownItem className="bazinga" component="div">
      Test
    </CxDropdownItem>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('dropdown-item')
})

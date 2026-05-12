import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxDropdown, CxDropdownMenu } from '../../../index'

test('loads and displays CxDropdownMenu component', async () => {
  const { container } = render(<CxDropdownMenu>Test</CxDropdownMenu>)
  expect(container).toMatchSnapshot()
})

test('CxDropdownMenu customize', async () => {
  const { container } = render(
    <CxDropdown visible={true}>
      <CxDropdownMenu className="bazinga" component="div">
        Test
      </CxDropdownMenu>
    </CxDropdown>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild?.firstChild).toHaveClass('bazinga')
  expect(container.firstChild?.firstChild).toHaveClass('dropdown-menu')
  expect(container.firstChild?.firstChild).toHaveClass('show')
})

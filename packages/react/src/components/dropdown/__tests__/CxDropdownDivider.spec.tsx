import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxDropdownDivider } from '../../../index'

test('loads and displays CxDropdownDivider component', async () => {
  const { container } = render(<CxDropdownDivider />)
  expect(container).toMatchSnapshot()
})

test('CxDropdownDivider customize', async () => {
  const { container } = render(<CxDropdownDivider className="bazinga" />)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('dropdown-divider')
})

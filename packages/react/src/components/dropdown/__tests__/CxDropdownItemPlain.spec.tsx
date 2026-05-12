import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxDropdownItemPlain } from '../../../index'

test('loads and displays CxDropdownItemPlain component', async () => {
  const { container } = render(<CxDropdownItemPlain>Test</CxDropdownItemPlain>)
  expect(container).toMatchSnapshot()
})

test('CxDropdownItemPlain customize', async () => {
  const { container } = render(
    <CxDropdownItemPlain className="bazinga" component="div">
      Test
    </CxDropdownItemPlain>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('dropdown-item-text')
})

import * as React from 'react'
import { render } from '@testing-library/react'

import { CxFormSelect } from '../../../index'

test('loads and displays CxFormSelect component', async () => {
  const { container } = render(<CxFormSelect></CxFormSelect>)
  expect(container).toMatchSnapshot()
})

test('CxFormSelect customize', async () => {
  const { container } = render(
    <CxFormSelect className="bazinga" size="large">
      <option value="A">B</option>
      <option>C</option>
    </CxFormSelect>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('form-select')
  expect(container.firstChild).toHaveClass('form-select-large')
})

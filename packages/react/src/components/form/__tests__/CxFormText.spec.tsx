import * as React from 'react'
import { render } from '@testing-library/react'

import { CxFormText } from '../../../index'

test('loads and displays CxFormText component', async () => {
  const { container } = render(<CxFormText>Test</CxFormText>)
  expect(container).toMatchSnapshot()
})

test('CxFormText customize', async () => {
  const { container } = render(
    <CxFormText className="bazinga" component="h3">
      Test
    </CxFormText>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('form-help')
})

import * as React from 'react'
import { render } from '@testing-library/react'

import { CxFormFloating } from '../../../index'

test('loads and displays CxFormFloating component', async () => {
  const { container } = render(<CxFormFloating />)
  expect(container).toMatchSnapshot()
})

test('CxFormFloating customize', async () => {
  const { container } = render(<CxFormFloating className="bazinga">Test</CxFormFloating>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('form-floating')
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveTextContent('Test')
})

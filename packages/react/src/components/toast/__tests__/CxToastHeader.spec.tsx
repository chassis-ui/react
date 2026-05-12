import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxToastHeader } from '../../../index'

test('loads and displays CxToastHeader component', async () => {
  const { container } = render(<CxToastHeader>Test</CxToastHeader>)
  expect(container).toMatchSnapshot()
})

test('CxToastHeader customize', async () => {
  const { container } = render(<CxToastHeader className="bazinga">Test</CxToastHeader>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('toast-header')
})

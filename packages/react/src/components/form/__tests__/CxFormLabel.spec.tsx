import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxFormLabel } from '../../../index'

test('loads and displays CxFormLabel component', async () => {
  const { container } = render(<CxFormLabel>Test</CxFormLabel>)
  expect(container).toMatchSnapshot()
})

test('CxFormLabel customize className', async () => {
  const { container } = render(<CxFormLabel className="bazinga">Test</CxFormLabel>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('form-label')
  expect(container.firstChild).toHaveTextContent('Test')
})

test('CxFormLabel customize htmlFor', async () => {
  const { container } = render(<CxFormLabel htmlFor="bazinga">Test</CxFormLabel>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveAttribute('for', 'bazinga')
  expect(container.firstChild).toHaveClass('form-label')
  expect(container.firstChild).toHaveTextContent('Test')
})

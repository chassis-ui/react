import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxFormInput } from '../../../index'

test('loads and displays CxFormInput component', async () => {
  const { container } = render(<CxFormInput />)
  expect(container).toMatchSnapshot()
})

test('CxFormInput customize one', async () => {
  const { container } = render(<CxFormInput />)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('form-input')
})

test('CxFormInput customize two', async () => {
  const { container } = render(
    <CxFormInput
      className="bazinga"
      disabled={true}
      invalid={true}
      plainText={true}
      readOnly={true}
      size="large"
      type="color"
      valid={true}
      value="#888888"
    />,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('large')
  expect(container.firstChild).toHaveClass('form-input-color')
  expect(container.firstChild).toHaveClass('is-invalid')
  expect(container.firstChild).toHaveClass('is-valid')
  expect(container.firstChild).toHaveClass('form-control-plaintext')
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveAttribute('value', '#888888')
  expect(container.firstChild).toHaveAttribute('type', 'color')
  expect(container.firstChild).toHaveAttribute('disabled', '')
  expect(container.firstChild).toHaveAttribute('readonly', '')
})

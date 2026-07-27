import * as React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { CxFormInput } from '../../../index'

test('loads and displays CxFormInput component', async () => {
  const { container } = render(<CxFormInput />)
  expect(container).toMatchSnapshot()
})

test('CxFormInput customize', async () => {
  const { container } = render(
    <CxFormInput
      className="bazinga"
      disabled={true}
      plainText={true}
      readOnly={true}
      size="large"
      type="color"
      value="value"
    />
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('form-control-plaintext')
  expect(container.firstChild).toHaveClass('form-input-color')
  expect(container.firstChild).toHaveClass('large')
})

test('CxFormInput change input', async () => {
  jest.useFakeTimers()
  const onChange = jest.fn()
  render(<CxFormInput onChange={onChange} />)
  expect(onChange).toHaveBeenCalledTimes(0)
  const input = document.querySelector('input')
  if (input !== null) {
    fireEvent.change(input, { target: { value: 'bazinga' } })
  }
  expect(onChange).toHaveBeenCalledTimes(1)
  if (input !== null) {
    fireEvent.change(input, { target: { value: '2' } })
  }
  expect(onChange).toHaveBeenCalledTimes(2)
})

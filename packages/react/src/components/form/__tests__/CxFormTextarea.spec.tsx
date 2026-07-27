import * as React from 'react'
import { render } from '@testing-library/react'

import { CxFormTextarea } from '../../../index'

test('loads and displays CxFormTextarea component', async () => {
  const { container } = render(<CxFormTextarea defaultValue="Some value" />)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('form-input')
})

test('CxFormTextarea customize', async () => {
  const { container } = render(
    <CxFormTextarea
      className="bazinga"
      disabled={true}
      invalid={true}
      plainText={true}
      readOnly={true}
      valid={true}
      defaultValue="Some value"
    />
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('form-control-plaintext')
  expect(container.firstChild).toHaveClass('is-invalid')
  expect(container.firstChild).toHaveClass('is-valid')
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveTextContent('Some value')
  expect(container.firstChild).toHaveAttribute('disabled', '')
  expect(container.firstChild).toHaveAttribute('readonly', '')
})

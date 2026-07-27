import * as React from 'react'
import { render } from '@testing-library/react'

import { CxFormFeedback } from '../../../index'

test('loads and displays CxFormFeedback component', async () => {
  const { container } = render(<CxFormFeedback />)
  expect(container).toMatchSnapshot()
})

test('CxFormFeedback customize one', async () => {
  const { container } = render(
    <CxFormFeedback className="bazinga" invalid={true} valid={true} tooltip={true} />
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('invalid-tooltip')
  expect(container.firstChild).toHaveClass('valid-tooltip')
  expect(container.firstChild).toHaveClass('bazinga')
})

test('CxFormFeedback customize two', async () => {
  const { container } = render(
    <CxFormFeedback className="bazinga" invalid={true} valid={true} tooltip={false} />
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('invalid-feedback')
  expect(container.firstChild).toHaveClass('valid-feedback')
  expect(container.firstChild).toHaveClass('bazinga')
})

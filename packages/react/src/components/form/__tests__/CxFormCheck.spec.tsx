import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxFormCheck } from '../../../index'

test('loads and displays CxFormCheck component', async () => {
  const { container } = render(<CxFormCheck />)
  expect(container).toMatchSnapshot()
})

test('CxFormCheck customize button=false', async () => {
  const { container } = render(
    <CxFormCheck className="bazinga" id="id" inline={true} label="label" type="radio" />,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('form-check')
  expect(container.firstChild).toHaveClass('form-check-inline')
})

test('CxFormCheck customize button=true', async () => {
  const { container } = render(
    <CxFormCheck
      button={{ context: 'primary', size: "large", shape: 'rounded', variant: 'ghost' }}
      className="bazinga"
      id="id"
      inline={true}
      label="label"
      type="radio"
    />,
  )
  expect(container).toMatchSnapshot()
})

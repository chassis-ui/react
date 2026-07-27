import * as React from 'react'
import { render } from '@testing-library/react'

import { CxCol } from '../../../index'

test('CxCol no-breakpoints', async () => {
  const { container } = render(<CxCol>Test</CxCol>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('col')
})

test('CxCol customize breakpoints are numbers', async () => {
  const { container } = render(
    <CxCol className="bazinga" xs={1} sm={2} md={3} lg={4} xl={5} xxl={6}>
      Test
    </CxCol>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('col-1')
  expect(container.firstChild).toHaveClass('small:col-2')
  expect(container.firstChild).toHaveClass('medium:col-3')
  expect(container.firstChild).toHaveClass('large:col-4')
  expect(container.firstChild).toHaveClass('xlarge:col-5')
  expect(container.firstChild).toHaveClass('2xlarge:col-6')
})

test('CxCol customize breakpoints are boolean', async () => {
  const { container } = render(
    <CxCol className="bazinga" xs={true} sm={true} md={true} lg={true} xl={true} xxl={true}>
      Test
    </CxCol>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('col')
  expect(container.firstChild).toHaveClass('col-small')
  expect(container.firstChild).toHaveClass('col-medium')
  expect(container.firstChild).toHaveClass('col-large')
  expect(container.firstChild).toHaveClass('col-xlarge')
  expect(container.firstChild).toHaveClass('col-2xlarge')
})

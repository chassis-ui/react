import * as React from 'react'
import { render } from '@testing-library/react'

import { CxListGroup, CxListGroupItem } from '../../../index'

test('loads and displays CxListGroup component', async () => {
  const { container } = render(<CxListGroup>Test</CxListGroup>)
  expect(container).toMatchSnapshot()
})

test('CxListGroup customize', async () => {
  const { container } = render(
    <CxListGroup className="bazinga" component="h3" flush={true} layout="horizontal-xlarge">
      Test
    </CxListGroup>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('list-group')
  expect(container.firstChild).toHaveClass('list-group-flush')
  expect(container.firstChild).toHaveClass('list-group-horizontal-xlarge')
})

test('CxListGroup example', async () => {
  const { container } = render(
    <CxListGroup>
      <CxListGroupItem>A</CxListGroupItem>
      <CxListGroupItem>B</CxListGroupItem>
      <CxListGroupItem>C</CxListGroupItem>
    </CxListGroup>,
  )
  expect(container).toMatchSnapshot()
})

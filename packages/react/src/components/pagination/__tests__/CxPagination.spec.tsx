import * as React from 'react'
import { render } from '@testing-library/react'

import { CxPagination, CxPaginationItem } from '../../../index'

test('loads and displays CxPagination component', async () => {
  const { container } = render(<CxPagination>Test</CxPagination>)
  expect(container).toMatchSnapshot()
})

test('CxPagination customize', async () => {
  const { container } = render(
    <CxPagination className="bazinga" aria-label="ariaLabel" size="large">
      Test
    </CxPagination>,
  )
  expect(container).toMatchSnapshot()
  let element = container.firstChild
  if (element !== null) {
    element = element.firstChild
    expect(element).toHaveClass('bazinga')
    expect(element).toHaveClass('pagination')
    expect(element).toHaveClass('pagination-large')
  } else {
    expect(true).toBe(false)
  }
})

test('CxPagination example', async () => {
  const { container } = render(
    <CxPagination>
      <CxPaginationItem>A</CxPaginationItem>
      <CxPaginationItem>B</CxPaginationItem>
      <CxPaginationItem>C</CxPaginationItem>
    </CxPagination>,
  )
  expect(container).toMatchSnapshot()
})

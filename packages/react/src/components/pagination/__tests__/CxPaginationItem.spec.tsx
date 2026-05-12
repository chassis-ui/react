import * as React from 'react'
import { render } from '@testing-library/react'

import { CxPaginationItem } from '../../../index'

test('loads and displays CxPaginationItem component', async () => {
  const { container } = render(<CxPaginationItem>Test</CxPaginationItem>)
  expect(container).toMatchSnapshot()
})

test('CxPaginationItem customize', async () => {
  const { container } = render(
    <CxPaginationItem className="bazinga" active={true} component="h3" disabled={true}>
      Test
    </CxPaginationItem>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('page-item')
  expect(container.firstChild).toHaveClass('active')
  expect(container.firstChild).toHaveClass('disabled')
  let element = container.firstChild
  if (element !== null) {
    element = element.firstChild
    expect(element).toHaveClass('page-link')
  } else {
    expect(true).toBe(false)
  }
})

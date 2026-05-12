import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxBreadcrumbItem } from '../../../index'

test('loads and displays CxBreadcrumbItem component', async () => {
  const { container } = render(<CxBreadcrumbItem>Test</CxBreadcrumbItem>)
  expect(container).toMatchSnapshot()
})

test('CxBreadcrumbItem customize', async () => {
  const { container } = render(
    <CxBreadcrumbItem active={true} className="bazinga">
      Test
    </CxBreadcrumbItem>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('breadcrumb-item')
  expect(container.firstChild).toHaveClass('active')
})

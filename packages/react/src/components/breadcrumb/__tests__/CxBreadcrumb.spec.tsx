import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxBreadcrumb, CxBreadcrumbItem } from '../../../index'

test('loads and displays CxBreadcrumb component', async () => {
  const { container } = render(<CxBreadcrumb></CxBreadcrumb>)
  expect(container).toMatchSnapshot()
})

test('CxBreadcrumb customize', async () => {
  const { container } = render(
    <CxBreadcrumb className="bazinga">
      <CxBreadcrumbItem>Test A</CxBreadcrumbItem>
      <CxBreadcrumbItem active={false}>Test B</CxBreadcrumbItem>
      <CxBreadcrumbItem active={true}>Test C</CxBreadcrumbItem>
    </CxBreadcrumb>,
  )
  const ol = container.querySelector('ol')
  expect(container).toMatchSnapshot()
  expect(ol).toHaveClass('bazinga')
})

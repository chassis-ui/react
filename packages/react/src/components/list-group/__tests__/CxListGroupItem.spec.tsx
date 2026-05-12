import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxListGroupItem } from '../../../index'

test('loads and displays CxListGroupItem component', async () => {
  const { container } = render(<CxListGroupItem>Test</CxListGroupItem>)
  expect(container).toMatchSnapshot()
})

test('CxListGroupItem customize', async () => {
  const { container } = render(
    <CxListGroupItem
      className="bazinga"
      active={true}
      context="warning"
      disabled={true}
      component="button"
    >
      Test
    </CxListGroupItem>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('list-item')
  expect(container.firstChild).toHaveClass('action')
  expect(container.firstChild).toHaveClass('active')
  expect(container.firstChild).toHaveClass('disabled')
})

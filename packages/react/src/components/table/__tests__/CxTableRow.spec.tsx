import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxTableBody, CxTableHeaderCell, CxTableRow } from '../../../index'

test('loads and displays CxTableRow component', async () => {
  const table = document.createElement('table')
  const { container } = render(
    <CxTableBody>
      <CxTableRow />
    </CxTableBody>,
    {
      container: document.body.appendChild(table),
    },
  )
  expect(container).toMatchSnapshot()
})

test('CxTableRow customize', async () => {
  const table = document.createElement('table')
  const { container } = render(
    <CxTableBody>
      <CxTableRow className="bazinga" active={true} align="middle" context="info">
        <CxTableHeaderCell>Test</CxTableHeaderCell>
      </CxTableRow>
    </CxTableBody>,
    {
      container: document.body.appendChild(table),
    },
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild?.firstChild).toHaveClass('align-middle')
  expect(container.firstChild?.firstChild).toHaveClass('table-active')
  expect(container.firstChild?.firstChild).toHaveClass('table-info')
  expect(container.firstChild?.firstChild).toHaveClass('bazinga')
  expect(container.firstChild?.firstChild?.firstChild).toHaveTextContent('Test')
})

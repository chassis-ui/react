import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxTableBody, CxTableDataCell, CxTableRow } from '../../../index'

test('loads and displays CxTableBody component', async () => {
  const table = document.createElement('table')
  const { container } = render(<CxTableBody />, {
    container: document.body.appendChild(table),
  })
  expect(container).toMatchSnapshot()
})

test('CxTableBody customize', async () => {
  const table = document.createElement('table')
  const { container } = render(
    <CxTableBody className="bazinga" context="info">
      <CxTableRow>
        <CxTableDataCell> Test</CxTableDataCell>
      </CxTableRow>
    </CxTableBody>,
    {
      container: document.body.appendChild(table),
    },
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('table-info')
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveTextContent('Test')
})

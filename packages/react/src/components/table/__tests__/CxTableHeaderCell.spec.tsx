import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxTableHead, CxTableHeaderCell, CxTableRow } from '../../../index'

test('loads and displays CxTableHeaderCell component', async () => {
  const table = document.createElement('table')
  const { container } = render(
    <CxTableHead>
      <CxTableRow>
        <CxTableHeaderCell />
      </CxTableRow>
    </CxTableHead>,
    {
      container: document.body.appendChild(table),
    },
  )
  expect(container).toMatchSnapshot()
})

test('CxTableHeaderCell customize', async () => {
  const table = document.createElement('table')
  const { container } = render(
    <CxTableHead>
      <CxTableRow>
        <CxTableHeaderCell className="bazinga" context="info">
          Test
        </CxTableHeaderCell>
      </CxTableRow>
    </CxTableHead>,
    {
      container: document.body.appendChild(table),
    },
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild?.firstChild?.firstChild).toHaveClass('table-info')
  expect(container.firstChild?.firstChild?.firstChild).toHaveClass('bazinga')
  expect(container.firstChild?.firstChild?.firstChild).toHaveTextContent('Test')
})

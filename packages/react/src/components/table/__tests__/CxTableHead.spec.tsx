import * as React from 'react'
import { render } from '@testing-library/react'

import { CxTableHead, CxTableHeaderCell, CxTableRow } from '../../../index'

test('loads and displays CxTableHead component', async () => {
  const table = document.createElement('table')
  const { container } = render(<CxTableHead />, {
    container: document.body.appendChild(table),
  })
  expect(container).toMatchSnapshot()
})

test('CxTableHead customize', async () => {
  const table = document.createElement('table')
  const { container } = render(
    <CxTableHead className="bazinga" context="info">
      <CxTableRow>
        <CxTableHeaderCell>Test</CxTableHeaderCell>
      </CxTableRow>
    </CxTableHead>,
    {
      container: document.body.appendChild(table),
    },
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('table-info')
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild?.firstChild?.firstChild).toHaveTextContent('Test')
})

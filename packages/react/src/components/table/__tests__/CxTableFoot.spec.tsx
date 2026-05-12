import * as React from 'react'
import { render } from '@testing-library/react'

import { CxTableFoot, CxTableHeaderCell, CxTableRow } from '../../../index'

test('loads and displays CxTableFoot component', async () => {
  const table = document.createElement('table')
  const { container } = render(<CxTableFoot />, {
    container: document.body.appendChild(table),
  })
  expect(container).toMatchSnapshot()
})

test('CxTableFoot customize', async () => {
  const table = document.createElement('table')
  const { container } = render(
    <CxTableFoot className="bazinga" context="info">
      <CxTableRow>
        <CxTableHeaderCell>Test</CxTableHeaderCell>
      </CxTableRow>
    </CxTableFoot>,
    {
      container: document.body.appendChild(table),
    },
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('table-info')
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild?.firstChild?.firstChild).toHaveTextContent('Test')
})

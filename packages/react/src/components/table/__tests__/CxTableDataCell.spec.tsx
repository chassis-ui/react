import * as React from 'react'
import { render } from '@testing-library/react'

import { CxTableDataCell } from '../../../index'
import { CxTableBody } from '../CxTableBody'
import { CxTableRow } from '../CxTableRow'

test('loads and displays CxTableDataCell component', async () => {
  const table = document.createElement('table')
  const { container } = render(
    <CxTableBody>
      <CxTableRow>
        <CxTableDataCell />
      </CxTableRow>
    </CxTableBody>,
    {
      container: document.body.appendChild(table),
    },
  )
  expect(container).toMatchSnapshot()
})

test('CxTableDataCell customize', async () => {
  const table = document.createElement('table')
  const { container } = render(
    <CxTableBody>
      <CxTableRow>
        <CxTableDataCell className="bazinga" active={true} align="middle" context="info">
          Test
        </CxTableDataCell>
      </CxTableRow>
    </CxTableBody>,
    {
      container: document.body.appendChild(table),
    },
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild?.firstChild?.firstChild).toHaveClass('align-middle')
  expect(container.firstChild?.firstChild?.firstChild).toHaveClass('active')
  expect(container.firstChild?.firstChild?.firstChild).toHaveClass('info')
  expect(container.firstChild?.firstChild?.firstChild).toHaveClass('bazinga')
  expect(container.firstChild?.firstChild?.firstChild).toHaveTextContent('Test')
})

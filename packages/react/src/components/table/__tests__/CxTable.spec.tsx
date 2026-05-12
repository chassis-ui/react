import * as React from 'react'
import { render } from '@testing-library/react'

import {
  CxTable,
  CxTableCaption,
  CxTableHead,
  CxTableRow,
  CxTableHeaderCell,
  CxTableBody,
  CxTableDataCell,
  CxTableFoot,
} from '../../../index'

test('loads and displays CxTable component', async () => {
  const { container } = render(<CxTable />)
  expect(container).toMatchSnapshot()
})

test('CxTable customize', async () => {
  const { container } = render(
    <CxTable
      className="bazinga"
      align="middle"
      bordered={true}
      borderless={true}
      caption="top"
      context="info"
      hover={true}
      responsive="xlarge"
      small={true}
      striped={true}
    >
      <CxTableBody>
        <CxTableRow>
          <CxTableDataCell>Test</CxTableDataCell>
        </CxTableRow>
      </CxTableBody>
    </CxTable>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('table-responsive-xlarge')
  if (container.firstChild === null) {
    expect(true).toBe(false)
  } else {
    expect(container.firstChild.firstChild).toHaveClass('table')
    expect(container.firstChild.firstChild).toHaveClass('align-middle')
    expect(container.firstChild.firstChild).toHaveClass('caption-top')
    expect(container.firstChild.firstChild).toHaveClass('info')
    expect(container.firstChild.firstChild).toHaveClass('bordered')
    expect(container.firstChild.firstChild).toHaveClass('borderless')
    expect(container.firstChild.firstChild).toHaveClass('hoverable')
    expect(container.firstChild.firstChild).toHaveClass('small')
    expect(container.firstChild.firstChild).toHaveClass('striped')
    expect(container.firstChild.firstChild).toHaveClass('bazinga')
    expect(container.firstChild.firstChild).toHaveTextContent('Test')
  }
})

test('CxTable full example test', async () => {
  const { container } = render(
    <CxTable caption="top">
      <CxTableCaption>List of users</CxTableCaption>
      <CxTableHead>
        <CxTableRow>
          <CxTableHeaderCell>#</CxTableHeaderCell>
          <CxTableHeaderCell>Class</CxTableHeaderCell>
          <CxTableHeaderCell>Heading</CxTableHeaderCell>
          <CxTableHeaderCell>Heading</CxTableHeaderCell>
        </CxTableRow>
      </CxTableHead>
      <CxTableBody>
        <CxTableRow>
          <CxTableHeaderCell>1</CxTableHeaderCell>
          <CxTableDataCell>Mark</CxTableDataCell>
          <CxTableDataCell>Otto</CxTableDataCell>
          <CxTableDataCell>@mdo</CxTableDataCell>
        </CxTableRow>
        <CxTableRow>
          <CxTableHeaderCell>2</CxTableHeaderCell>
          <CxTableDataCell>Jacob</CxTableDataCell>
          <CxTableDataCell>Thornton</CxTableDataCell>
          <CxTableDataCell>@fat</CxTableDataCell>
        </CxTableRow>
        <CxTableRow>
          <CxTableHeaderCell>3</CxTableHeaderCell>
          <CxTableDataCell>Larry</CxTableDataCell>
          <CxTableDataCell>the Bird</CxTableDataCell>
          <CxTableDataCell>@twitter</CxTableDataCell>
        </CxTableRow>
      </CxTableBody>
      <CxTableFoot>
        <CxTableRow>
          <CxTableHeaderCell>#</CxTableHeaderCell>
          <CxTableHeaderCell>Class</CxTableHeaderCell>
          <CxTableHeaderCell>Heading</CxTableHeaderCell>
          <CxTableHeaderCell>Heading</CxTableHeaderCell>
        </CxTableRow>
      </CxTableFoot>
    </CxTable>,
  )
  expect(container).toMatchSnapshot()
})

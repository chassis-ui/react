import React from 'react'
import {
  CxTable,
  CxTableBody,
  CxTableCell,
  CxTableColumn,
  CxTableHeader,
  CxTableRow,
} from '@chassis-ui/react'

const columns = ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5', 'Column 6', 'Column 7']
const rows = [1, 2, 3]

export const ResponsiveExample = () => (
  <CxTable aria-label="Wide data" responsive>
    <CxTableHeader>
      {columns.map((col) => (
        <CxTableColumn key={col}>{col}</CxTableColumn>
      ))}
    </CxTableHeader>
    <CxTableBody items={rows.map((id) => ({ id }))}>
      {(row) => (
        <CxTableRow key={row.id}>
          {(columnKey) => <CxTableCell>{`Row ${row.id}, ${columnKey}`}</CxTableCell>}
        </CxTableRow>
      )}
    </CxTableBody>
  </CxTable>
)

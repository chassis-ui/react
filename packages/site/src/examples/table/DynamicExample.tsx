import React from 'react'
import {
  CxTable,
  CxTableBody,
  CxTableCell,
  CxTableColumn,
  CxTableHeader,
  CxTableRow,
} from '@chassis-ui/react'

const columns = [
  { id: 'firstName', name: 'First name' },
  { id: 'lastName', name: 'Last name' },
  { id: 'handle', name: 'Username' },
]

const rows = [
  { id: 1, firstName: 'Mark', lastName: 'Otto', handle: '@mdo' },
  { id: 2, firstName: 'Jacob', lastName: 'Thornton', handle: '@fat' },
  { id: 3, firstName: 'Larry', lastName: 'Bird', handle: '@twitter' },
]

export const DynamicExample = () => (
  <CxTable aria-label="Users">
    <CxTableHeader columns={columns}>
      {(column) => <CxTableColumn key={column.id}>{column.name}</CxTableColumn>}
    </CxTableHeader>
    <CxTableBody items={rows}>
      {(row) => (
        <CxTableRow key={row.id}>
          {(columnKey) => <CxTableCell>{row[columnKey as keyof typeof row]}</CxTableCell>}
        </CxTableRow>
      )}
    </CxTableBody>
  </CxTable>
)

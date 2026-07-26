import { useState } from 'react'
import type { Selection } from 'react-stately'
import {
  CxTable,
  CxTableBody,
  CxTableCell,
  CxTableColumn,
  CxTableHeader,
  CxTableRow
} from '@chassis-ui/react'

const rows = [
  { id: 1, name: 'Mark Otto', role: 'Engineer' },
  { id: 2, name: 'Jacob Thornton', role: 'Designer' },
  { id: 3, name: 'Larry Bird', role: 'Engineer' }
]

export const SelectionExample = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())

  return (
    <CxTable
      aria-label="Team"
      onSelectionChange={setSelectedKeys}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
    >
      <CxTableHeader>
        <CxTableColumn key="name">Name</CxTableColumn>
        <CxTableColumn key="role">Role</CxTableColumn>
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
}

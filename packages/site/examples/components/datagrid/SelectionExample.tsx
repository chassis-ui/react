import { useState } from 'react'
import type { Selection } from 'react-stately'
import {
  DataGrid,
  DataGridHeader,
  DataGridColumn,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridSelectAllCell,
  DataGridSelectionCell
} from '@chassis-ui/react'

const rows = [
  { id: 1, name: 'Mark Otto', role: 'Engineer' },
  { id: 2, name: 'Jacob Thornton', role: 'Designer' },
  { id: 3, name: 'Larry Bird', role: 'Engineer' }
]

export const Example = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())

  return (
    <DataGrid
      aria-label="Team"
      onSelectionChange={setSelectedKeys}
      rowHeight={40}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
    >
      <DataGridHeader>
        <DataGridColumn className="datagrid-selection-cell" defaultWidth={44} minWidth={44}>
          <DataGridSelectAllCell />
        </DataGridColumn>
        <DataGridColumn isRowHeader>Name</DataGridColumn>
        <DataGridColumn>Role</DataGridColumn>
      </DataGridHeader>
      <DataGridBody items={rows}>
        {(row) => (
          <DataGridRow id={row.id}>
            <DataGridCell className="datagrid-selection-cell">
              <DataGridSelectionCell />
            </DataGridCell>
            <DataGridCell>{row.name}</DataGridCell>
            <DataGridCell>{row.role}</DataGridCell>
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  )
}

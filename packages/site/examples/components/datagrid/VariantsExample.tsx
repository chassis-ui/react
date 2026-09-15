import {
  DataGrid,
  DataGridHeader,
  DataGridColumn,
  DataGridBody,
  DataGridRow,
  DataGridCell
} from '@chassis-ui/react'

const rows = [
  { id: 1, name: 'Mark Otto', role: 'Engineer' },
  { id: 2, name: 'Jacob Thornton', role: 'Designer' },
  { id: 3, name: 'Larry Bird', role: 'Engineer' }
]

export const Example = () => (
  <DataGrid aria-label="Team" bordered hover rowHeight={40} sm>
    <DataGridHeader>
      <DataGridColumn isRowHeader>Name</DataGridColumn>
      <DataGridColumn>Role</DataGridColumn>
    </DataGridHeader>
    <DataGridBody items={rows}>
      {(row) => (
        <DataGridRow id={row.id}>
          <DataGridCell>{row.name}</DataGridCell>
          <DataGridCell>{row.role}</DataGridCell>
        </DataGridRow>
      )}
    </DataGridBody>
  </DataGrid>
)

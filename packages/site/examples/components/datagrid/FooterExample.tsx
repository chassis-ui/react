import {
  DataGrid,
  DataGridHeader,
  DataGridColumn,
  DataGridBody,
  DataGridRow,
  DataGridCell
} from '@chassis-ui/react'

const rows = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
  role: ['Engineer', 'Designer', 'Product'][i % 3]
}))

export const Example = () => (
  <DataGrid aria-label="Users" bordered footer={`${rows.length} users total`} rowHeight={40}>
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

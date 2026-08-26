import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@chassis-ui/react'

const columns = ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5', 'Column 6', 'Column 7']
const rows = [1, 2, 3]

export const Example = () => (
  <Table aria-label="Wide data" responsive>
    <TableHeader>
      {columns.map((col) => (
        <TableColumn key={col}>{col}</TableColumn>
      ))}
    </TableHeader>
    <TableBody items={rows.map((id) => ({ id }))}>
      {(row) => (
        <TableRow key={row.id}>
          {(columnKey) => <TableCell>{`Row ${row.id}, ${columnKey}`}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
)

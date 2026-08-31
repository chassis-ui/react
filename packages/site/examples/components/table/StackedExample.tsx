import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@chassis-ui/react'

const rows = [
  { id: 1, name: 'Alice Martin', role: 'Admin', email: 'alice@example.com', status: 'Active' },
  { id: 2, name: 'Bob Chen', role: 'Editor', email: 'bob@example.com', status: 'Active' },
  { id: 3, name: 'Carol White', role: 'Viewer', email: 'carol@example.com', status: 'Inactive' }
]

export const Example = () => (
  <Table aria-label="Users" stacked="medium">
    <TableHeader>
      <TableColumn key="name">Name</TableColumn>
      <TableColumn key="role">Role</TableColumn>
      <TableColumn key="email">Email</TableColumn>
      <TableColumn key="status">Status</TableColumn>
    </TableHeader>
    <TableBody items={rows}>
      {(row) => (
        <TableRow key={row.id}>
          {(columnKey) => <TableCell>{row[columnKey as keyof typeof row]}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
)

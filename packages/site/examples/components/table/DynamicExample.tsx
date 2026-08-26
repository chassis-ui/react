import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@chassis-ui/react'

const columns = [
  { id: 'firstName', name: 'First name' },
  { id: 'lastName', name: 'Last name' },
  { id: 'handle', name: 'Username' }
]

const rows = [
  { id: 1, firstName: 'Mark', lastName: 'Otto', handle: '@mdo' },
  { id: 2, firstName: 'Jacob', lastName: 'Thornton', handle: '@fat' },
  { id: 3, firstName: 'Larry', lastName: 'Bird', handle: '@twitter' }
]

export const Example = () => (
  <Table aria-label="Users">
    <TableHeader columns={columns}>
      {(column) => <TableColumn key={column.id}>{column.name}</TableColumn>}
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

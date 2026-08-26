import { useState } from 'react'
import type { Selection } from 'react-stately'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@chassis-ui/react'

const rows = [
  { id: 1, name: 'Mark Otto', role: 'Engineer' },
  { id: 2, name: 'Jacob Thornton', role: 'Designer' },
  { id: 3, name: 'Larry Bird', role: 'Engineer' }
]

export const Example = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())

  return (
    <Table
      aria-label="Team"
      onSelectionChange={setSelectedKeys}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
    >
      <TableHeader>
        <TableColumn key="name">Name</TableColumn>
        <TableColumn key="role">Role</TableColumn>
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
}

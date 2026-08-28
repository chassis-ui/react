import { useMemo, useState } from 'react'
import {
  TextInput,
  Table,
  Badge,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@chassis-ui/react'

const allUsers = [
  { id: 1, name: 'Alice Martin', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Chen', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carol White', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'David Kim', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Eve Torres', role: 'Viewer', status: 'Active' },
  { id: 6, name: 'Frank Lee', role: 'Admin', status: 'Inactive' }
]

export const Example = () => {
  const statusColor = { Active: 'success', Inactive: 'secondary' } as const
  const [query, setQuery] = useState('')
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allUsers
    return allUsers.filter(
      (user) => user.name.toLowerCase().includes(q) || user.role.toLowerCase().includes(q)
    )
  }, [query])
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (v: string) => <Badge color={statusColor[v as keyof typeof statusColor]}>{v}</Badge>
    }
  ]
  return (
    <div>
      <TextInput
        type="search"
        label="Filter users"
        placeholder="Search by name or role"
        value={query}
        onChange={setQuery}
        className="mb-3"
      />
      <Table aria-label="Users" hover>
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
          {(row) => (
            <TableRow key={row.id}>
              {(columnKey) => {
                const column = columns.find((c) => c.key === columnKey)
                const value = row[columnKey as keyof typeof row]
                return (
                  <TableCell>{column?.render ? column.render(String(value)) : value}</TableCell>
                )
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {rows.length === 0 && <p className="text-secondary mt-3 mb-0">No users match "{query}".</p>}
    </div>
  )
}

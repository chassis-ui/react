import { useState, type ChangeEvent } from 'react'
import {
  Table,
  Pagination,
  Select,
  Badge,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@chassis-ui/react'

export const Example = () => {
  const allUsers = [
    { id: 1, name: 'Alice Martin', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Chen', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Carol White', role: 'Viewer', status: 'Inactive' },
    { id: 4, name: 'David Kim', role: 'Editor', status: 'Active' },
    { id: 5, name: 'Eve Torres', role: 'Viewer', status: 'Active' },
    { id: 6, name: 'Frank Lee', role: 'Admin', status: 'Inactive' },
    { id: 7, name: 'Grace Hall', role: 'Editor', status: 'Active' },
    { id: 8, name: 'Hank Patel', role: 'Viewer', status: 'Active' },
    { id: 9, name: 'Iris Clark', role: 'Editor', status: 'Inactive' },
    { id: 10, name: 'Jack Lewis', role: 'Viewer', status: 'Active' },
    { id: 11, name: 'Karen Scott', role: 'Admin', status: 'Active' },
    { id: 12, name: 'Leo Adams', role: 'Editor', status: 'Active' }
  ]
  const statusColor = { Active: 'success', Inactive: 'secondary' } as const
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const totalPages = Math.ceil(allUsers.length / pageSize)
  const offset = (page - 1) * pageSize
  const rows = allUsers.slice(offset, offset + pageSize)
  const columns = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (v: string) => <Badge color={statusColor[v as keyof typeof statusColor]}>{v}</Badge>
    }
  ]
  const handleSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value))
    setPage(1)
  }
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <small>{allUsers.length} users total</small>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="pg-size" className="form-label mb-0">
            Rows per page
          </label>
          <Select
            id="pg-size"
            style={{ width: 'auto' }}
            value={String(pageSize)}
            onChange={handleSizeChange}
            options={[
              { label: '3', value: '3' },
              { label: '5', value: '5' },
              { label: '10', value: '10' }
            ]}
          />
        </div>
      </div>
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
      <div className="d-flex justify-content-end mt-3">
        <Pagination
          pages={totalPages}
          activePage={page}
          onActivePageChange={setPage}
          aria-label="User table pagination"
        />
      </div>
    </div>
  )
}

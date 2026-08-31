import { useMemo, useState } from 'react'
import type { SortDescriptor } from 'react-stately'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@chassis-ui/react'

const rows = [
  { id: 1, name: 'Mark Otto', role: 'Engineer' },
  { id: 2, name: 'Jacob Thornton', role: 'Designer' },
  { id: 3, name: 'Larry Bird', role: 'Engineer' },
  { id: 4, name: 'Ashley Grant', role: 'Product' }
]

export const Example = () => {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending'
  })

  const sortedRows = useMemo(() => {
    const key = sortDescriptor.column as keyof (typeof rows)[number]
    const sorted = [...rows].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0))
    return sortDescriptor.direction === 'descending' ? sorted.reverse() : sorted
  }, [sortDescriptor])

  return (
    <Table aria-label="Team" onSortChange={setSortDescriptor} sortDescriptor={sortDescriptor}>
      <TableHeader>
        <TableColumn key="name" allowsSorting>
          Name
        </TableColumn>
        <TableColumn key="role" allowsSorting>
          Role
        </TableColumn>
      </TableHeader>
      <TableBody items={sortedRows}>
        {(row) => (
          <TableRow key={row.id}>
            {(columnKey) => <TableCell>{row[columnKey as keyof typeof row]}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

import { useMemo, useState } from 'react'
import type { SortDescriptor } from 'react-stately'
import { Table } from '@chassis-ui/react'

const rows = [
  { id: 1, name: 'Mark Otto', role: 'Engineer' },
  { id: 2, name: 'Jacob Thornton', role: 'Designer' },
  { id: 3, name: 'Larry Bird', role: 'Engineer' },
  { id: 4, name: 'Ashley Grant', role: 'Product' }
]

export const SortingExample = () => {
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
      <Table.Header>
        <Table.Column key="name" allowsSorting>
          Name
        </Table.Column>
        <Table.Column key="role" allowsSorting>
          Role
        </Table.Column>
      </Table.Header>
      <Table.Body items={sortedRows}>
        {(row) => (
          <Table.Row key={row.id}>
            {(columnKey) => <Table.Cell>{row[columnKey as keyof typeof row]}</Table.Cell>}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}

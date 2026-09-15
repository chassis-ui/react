import { useMemo, useState } from 'react'
import type { SortDescriptor } from 'react-stately'
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
    <DataGrid
      aria-label="Team"
      onSortChange={setSortDescriptor}
      rowHeight={40}
      sortDescriptor={sortDescriptor}
    >
      <DataGridHeader>
        <DataGridColumn allowsSorting id="name" isRowHeader>
          Name
        </DataGridColumn>
        <DataGridColumn allowsSorting id="role">
          Role
        </DataGridColumn>
      </DataGridHeader>
      <DataGridBody items={sortedRows}>
        {(row) => (
          <DataGridRow id={row.id}>
            <DataGridCell>{row.name}</DataGridCell>
            <DataGridCell>{row.role}</DataGridCell>
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  )
}

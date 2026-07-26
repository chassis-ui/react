import { useMemo, useState } from 'react'
import type { SortDescriptor } from 'react-stately'
import {
  CxTable,
  CxTableBody,
  CxTableCell,
  CxTableColumn,
  CxTableHeader,
  CxTableRow
} from '@chassis-ui/react'

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
    <CxTable aria-label="Team" onSortChange={setSortDescriptor} sortDescriptor={sortDescriptor}>
      <CxTableHeader>
        <CxTableColumn key="name" allowsSorting>
          Name
        </CxTableColumn>
        <CxTableColumn key="role" allowsSorting>
          Role
        </CxTableColumn>
      </CxTableHeader>
      <CxTableBody items={sortedRows}>
        {(row) => (
          <CxTableRow key={row.id}>
            {(columnKey) => <CxTableCell>{row[columnKey as keyof typeof row]}</CxTableCell>}
          </CxTableRow>
        )}
      </CxTableBody>
    </CxTable>
  )
}

import { useEffect, useState } from 'react'
import {
  Badge,
  Button,
  SkeletonLoader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@chassis-ui/react'

const FETCH_DELAY = 1500

const orders = [
  { id: '#1042', customer: 'Alice Martin', amount: '$120.00', status: 'Paid' },
  { id: '#1043', customer: 'Bob Chen', amount: '$85.50', status: 'Pending' },
  { id: '#1044', customer: 'Carol White', amount: '$240.00', status: 'Paid' }
] as const

const columns = [
  { key: 'id', label: 'Order', width: 2, span: 4 },
  { key: 'customer', label: 'Customer', width: 4, span: 8 },
  { key: 'amount', label: 'Amount', width: 2, span: 5 },
  { key: 'status', label: 'Status', width: 2, span: 4 }
]

const statusColor = { Paid: 'success', Pending: 'warning' } as const

export const Example = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loading) return
    const timeout = setTimeout(() => setLoading(false), FETCH_DELAY)
    return () => clearTimeout(timeout)
  }, [loading])

  return (
    <div className="vstack gap-medium">
      <span className="visually-hidden" aria-live="polite">
        {loading ? 'Loading recent orders…' : 'Recent orders loaded'}
      </span>
      {/* `key` forces a remount when `loading` flips — `Table` builds its row/cell collection
          once via `useTableState` and won't otherwise notice a value that changed only inside a
          cell's render closure. */}
      <Table
        aria-label="Recent orders"
        className={`align-middle${loading ? ' skeleton-glow' : ''}`}
        key={String(loading)}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn className={`col-${column.width}`} key={column.key}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={orders}>
          {(row) => (
            <TableRow key={row.id}>
              {(columnKey) => {
                const column = columns.find((c) => c.key === columnKey)!
                return (
                  <TableCell>
                    <SkeletonLoader
                      loading={loading}
                      spans={column.span}
                      component={columnKey === 'status' ? Badge : undefined}
                      color={columnKey === 'status' ? 'default' : undefined}
                    >
                      {columnKey === 'status' ? (
                        <Badge color={statusColor[row.status]}>{row.status}</Badge>
                      ) : (
                        row[columnKey as keyof typeof row]
                      )}
                    </SkeletonLoader>
                  </TableCell>
                )
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Button onClick={() => setLoading(true)} disabled={loading} className="align-self-start">
        Reload
      </Button>
    </div>
  )
}

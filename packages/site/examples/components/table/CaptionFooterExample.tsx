import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@chassis-ui/react'

const rows = [
  { id: 1, name: 'Mark Otto', amount: '$120' },
  { id: 2, name: 'Jacob Thornton', amount: '$80' }
]

export const Example = () => (
  <Table
    aria-label="Invoices"
    caption="Recent invoices"
    footer={
      <tr>
        <td>Total</td>
        <td>$200</td>
      </tr>
    }
  >
    <TableHeader>
      <TableColumn key="name">Name</TableColumn>
      <TableColumn key="amount">Amount</TableColumn>
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

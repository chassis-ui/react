import { Table } from '@chassis-ui/react'

const rows = [
  { id: 1, name: 'Mark Otto', amount: '$120' },
  { id: 2, name: 'Jacob Thornton', amount: '$80' }
]

export const CaptionFooterExample = () => (
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
    <Table.Header>
      <Table.Column key="name">Name</Table.Column>
      <Table.Column key="amount">Amount</Table.Column>
    </Table.Header>
    <Table.Body items={rows}>
      {(row) => (
        <Table.Row key={row.id}>
          {(columnKey) => <Table.Cell>{row[columnKey as keyof typeof row]}</Table.Cell>}
        </Table.Row>
      )}
    </Table.Body>
  </Table>
)

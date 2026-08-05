import { Table } from '@chassis-ui/react'

const columns = ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5', 'Column 6', 'Column 7']
const rows = [1, 2, 3]

export const ResponsiveExample = () => (
  <Table aria-label="Wide data" responsive>
    <Table.Header>
      {columns.map((col) => (
        <Table.Column key={col}>{col}</Table.Column>
      ))}
    </Table.Header>
    <Table.Body items={rows.map((id) => ({ id }))}>
      {(row) => (
        <Table.Row key={row.id}>
          {(columnKey) => <Table.Cell>{`Row ${row.id}, ${columnKey}`}</Table.Cell>}
        </Table.Row>
      )}
    </Table.Body>
  </Table>
)

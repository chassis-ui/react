import { Table } from '@chassis-ui/react'

const rows = [
  { id: 1, name: 'Mark Otto', role: 'Engineer' },
  { id: 2, name: 'Jacob Thornton', role: 'Designer' },
  { id: 3, name: 'Larry Bird', role: 'Engineer' }
]

export const VariantsExample = () => (
  <Table aria-label="Team" bordered hover small striped>
    <Table.Header>
      <Table.Column key="name">Name</Table.Column>
      <Table.Column key="role">Role</Table.Column>
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

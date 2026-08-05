import { Table } from '@chassis-ui/react'

const columns = [
  { id: 'firstName', name: 'First name' },
  { id: 'lastName', name: 'Last name' },
  { id: 'handle', name: 'Username' }
]

const rows = [
  { id: 1, firstName: 'Mark', lastName: 'Otto', handle: '@mdo' },
  { id: 2, firstName: 'Jacob', lastName: 'Thornton', handle: '@fat' },
  { id: 3, firstName: 'Larry', lastName: 'Bird', handle: '@twitter' }
]

export const DynamicExample = () => (
  <Table aria-label="Users">
    <Table.Header columns={columns}>
      {(column) => <Table.Column key={column.id}>{column.name}</Table.Column>}
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

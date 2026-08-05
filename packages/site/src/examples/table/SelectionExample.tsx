import { useState } from 'react'
import type { Selection } from 'react-stately'
import { Table } from '@chassis-ui/react'

const rows = [
  { id: 1, name: 'Mark Otto', role: 'Engineer' },
  { id: 2, name: 'Jacob Thornton', role: 'Designer' },
  { id: 3, name: 'Larry Bird', role: 'Engineer' }
]

export const SelectionExample = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())

  return (
    <Table
      aria-label="Team"
      onSelectionChange={setSelectedKeys}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
    >
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
}

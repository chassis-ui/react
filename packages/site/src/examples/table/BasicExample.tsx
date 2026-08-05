import { Table } from '@chassis-ui/react'

export const BasicExample = () => (
  <Table aria-label="Users">
    <Table.Header>
      <Table.Column key="firstName">First name</Table.Column>
      <Table.Column key="lastName">Last name</Table.Column>
      <Table.Column key="handle">Username</Table.Column>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Mark</Table.Cell>
        <Table.Cell>Otto</Table.Cell>
        <Table.Cell>@mdo</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Jacob</Table.Cell>
        <Table.Cell>Thornton</Table.Cell>
        <Table.Cell>@fat</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Larry</Table.Cell>
        <Table.Cell>Bird</Table.Cell>
        <Table.Cell>@twitter</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
)

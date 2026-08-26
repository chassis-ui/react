import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@chassis-ui/react'

export const Example = () => (
  <Table aria-label="Users">
    <TableHeader>
      <TableColumn key="firstName">First name</TableColumn>
      <TableColumn key="lastName">Last name</TableColumn>
      <TableColumn key="handle">Username</TableColumn>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Mark</TableCell>
        <TableCell>Otto</TableCell>
        <TableCell>@mdo</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Jacob</TableCell>
        <TableCell>Thornton</TableCell>
        <TableCell>@fat</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Larry</TableCell>
        <TableCell>Bird</TableCell>
        <TableCell>@twitter</TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

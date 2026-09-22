import { StaticTable } from '@chassis-ui/react/static-table'

const rows = [
  { id: 1, name: 'Alice Martin', role: 'Admin', email: 'alice@example.com', status: 'Active' },
  { id: 2, name: 'Bob Chen', role: 'Editor', email: 'bob@example.com', status: 'Active' },
  { id: 3, name: 'Carol White', role: 'Viewer', email: 'carol@example.com', status: 'Inactive' }
]

export const Example = () => (
  <StaticTable aria-label="Users" stacked="md">
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Role</th>
        <th scope="col">Email</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.id}>
          <td data-cell="Name">{row.name}</td>
          <td data-cell="Role">{row.role}</td>
          <td data-cell="Email">{row.email}</td>
          <td data-cell="Status">{row.status}</td>
        </tr>
      ))}
    </tbody>
  </StaticTable>
)

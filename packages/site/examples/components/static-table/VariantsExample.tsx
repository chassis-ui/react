import { StaticTable } from '@chassis-ui/react/static-table'

const rows = [
  { id: 1, name: 'Mark Otto', role: 'Engineer' },
  { id: 2, name: 'Jacob Thornton', role: 'Designer' },
  { id: 3, name: 'Larry Bird', role: 'Engineer' }
]

export const Example = () => (
  <StaticTable aria-label="Team" bordered hover sm striped>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Role</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.id}>
          <td>{row.name}</td>
          <td>{row.role}</td>
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr>
        <td colSpan={2}>3 members</td>
      </tr>
    </tfoot>
  </StaticTable>
)

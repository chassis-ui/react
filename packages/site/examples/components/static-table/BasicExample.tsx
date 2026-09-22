import { StaticTable } from '@chassis-ui/react/static-table'

const users = [
  { id: 1, name: 'Mark Otto', username: 'mdo', topics: 42 },
  { id: 2, name: 'Jacob Thornton', username: 'fat', topics: 17 },
  { id: 3, name: 'Larry Bird', username: 'twitter', topics: 8 }
]

export const Example = () => (
  <StaticTable caption="Most active members">
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Profile</th>
        <th scope="col">Topics</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>
            <a href={`#${user.username}`}>@{user.username}</a>
          </td>
          <td>{user.topics}</td>
        </tr>
      ))}
    </tbody>
  </StaticTable>
)

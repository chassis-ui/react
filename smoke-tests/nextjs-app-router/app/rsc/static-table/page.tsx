import Link from 'next/link'
import { StaticTable } from '@chassis-ui/react/static-table'
import { ClientMark } from '../ClientMark'

// `Table` reads its children as a collection and is a Client Component, so it can't be composed
// here. `StaticTable` is what a Server Component renders (#20, RSC.md).
export default function Page() {
  return (
    <main>
      <StaticTable caption="Users" hover striped>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Profile</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mark</td>
            <td>
              <Link href="/rsc/list">@mark</Link> <ClientMark />
            </td>
          </tr>
        </tbody>
      </StaticTable>
    </main>
  )
}

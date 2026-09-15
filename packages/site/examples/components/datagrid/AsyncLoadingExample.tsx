import { useState } from 'react'
import {
  DataGrid,
  DataGridHeader,
  DataGridColumn,
  DataGridBody,
  DataGridRow,
  DataGridCell
} from '@chassis-ui/react'

interface Person {
  id: number
  name: string
  role: string
}

const PAGE_SIZE = 20
const TOTAL = 200
const allPeople: Person[] = Array.from({ length: TOTAL }, (_, id) => ({
  id,
  name: `Person ${id}`,
  role: ['Engineer', 'Designer', 'Manager'][id % 3]
}))

// Stands in for a real paginated API call — replace with an actual fetch of the next page.
const fetchPeoplePage = (page: number): Promise<Person[]> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(allPeople.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)), 800)
  })

export const Example = () => {
  const [people, setPeople] = useState<Person[]>([])
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const onLoadMore = () => {
    setIsLoading(true)
    fetchPeoplePage(page).then((nextPage) => {
      setPeople((current) => [...current, ...nextPage])
      setPage((current) => current + 1)
      setIsLoading(false)
    })
  }

  const hasMore = people.length < TOTAL

  return (
    <DataGrid aria-label="People" rowHeight={40}>
      <DataGridHeader>
        <DataGridColumn isRowHeader>Name</DataGridColumn>
        <DataGridColumn>Role</DataGridColumn>
      </DataGridHeader>
      <DataGridBody
        isLoading={isLoading}
        items={people}
        loadingContent="Loading more…"
        onLoadMore={hasMore ? onLoadMore : undefined}
      >
        {(person) => (
          <DataGridRow id={person.id}>
            <DataGridCell>{person.name}</DataGridCell>
            <DataGridCell>{person.role}</DataGridCell>
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  )
}

import { useState } from 'react'
import { Pagination } from '@chassis-ui/react'

export const Example = () => {
  const [page, setPage] = useState(1)
  return <Pagination pages={10} activePage={page} onActivePageChange={setPage} aria-label="Demo" />
}

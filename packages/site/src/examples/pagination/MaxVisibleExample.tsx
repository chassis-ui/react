import { useState } from 'react'
import { Pagination } from '@chassis-ui/react'

export const Example = () => {
  const [page, setPage] = useState(5)
  return (
    <Pagination
      pages={20}
      activePage={page}
      onActivePageChange={setPage}
      maxVisiblePages={7}
      aria-label="Demo"
    />
  )
}

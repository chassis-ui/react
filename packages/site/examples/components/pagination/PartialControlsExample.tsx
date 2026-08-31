import { useState } from 'react'
import { Pagination } from '@chassis-ui/react'

export const Example = () => {
  const [page, setPage] = useState(1)
  // const [numbersPage, setNumbersPage] = useState(1)

  return (
    <div className="d-flex justify-content-between flex-wrap gap-medium">
      <Pagination
        pages={5}
        activePage={page}
        onActivePageChange={setPage}
        showPrevNext={false}
        aria-label="Numbers only"
      />
      <Pagination
        pages={5}
        activePage={page}
        onActivePageChange={setPage}
        showPageNumbers={false}
        aria-label="Directions only"
      />
    </div>
  )
}

import { useState } from 'react'
import { Pagination } from '@chassis-ui/react'

export const Example = () => {
  const [centerPage, setCenterPage] = useState(2)
  const [endPage, setEndPage] = useState(2)

  return (
    <>
      <Pagination
        align="center"
        pages={3}
        activePage={centerPage}
        onActivePageChange={setCenterPage}
        aria-label="Centered pagination"
      />
      <Pagination
        align="end"
        pages={3}
        activePage={endPage}
        onActivePageChange={setEndPage}
        aria-label="Right-aligned pagination"
      />
    </>
  )
}

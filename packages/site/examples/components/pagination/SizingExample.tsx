import { useState } from 'react'
import { Pagination } from '@chassis-ui/react'

export const Example = () => {
  const [lgPage, setLargePage] = useState(2)
  const [smPage, setSmallPage] = useState(2)

  return (
    <>
      <Pagination
        size="lg"
        pages={3}
        activePage={lgPage}
        onActivePageChange={setLargePage}
        aria-label="Large pagination example"
      />
      <Pagination
        size="sm"
        pages={3}
        activePage={smPage}
        onActivePageChange={setSmallPage}
        aria-label="Small pagination example"
      />
    </>
  )
}

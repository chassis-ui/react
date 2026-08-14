import { useState } from 'react'
import { Pagination } from '@chassis-ui/react'

export const Example = () => {
  const [largePage, setLargePage] = useState(2)
  const [smallPage, setSmallPage] = useState(2)

  return (
    <>
      <Pagination
        size="large"
        pages={3}
        activePage={largePage}
        onActivePageChange={setLargePage}
        aria-label="Large pagination example"
      />
      <Pagination
        size="small"
        pages={3}
        activePage={smallPage}
        onActivePageChange={setSmallPage}
        aria-label="Small pagination example"
      />
    </>
  )
}

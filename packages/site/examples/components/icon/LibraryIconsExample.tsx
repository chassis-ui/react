import { IconProvider, Pagination } from '@chassis-ui/react'
import { useState } from 'react'

export const Example = () => {
  const [page, setPage] = useState(2)

  return (
    <IconProvider icons={{ previous: 'arrow-left-outline', next: 'arrow-right-outline' }}>
      <Pagination activePage={page} pages={5} onActivePageChange={setPage} />
    </IconProvider>
  )
}

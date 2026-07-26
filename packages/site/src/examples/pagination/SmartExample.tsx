import { useState } from 'react'
import { CxPagination } from '@chassis-ui/react'

export const SmartExample = () => {
  const [page, setPage] = useState(1)
  return (
    <CxPagination pages={10} activePage={page} onActivePageChange={setPage} aria-label="Demo" />
  )
}

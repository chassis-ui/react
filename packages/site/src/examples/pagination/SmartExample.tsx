import React from 'react'
import { useState } from 'react'
import { CxPagination, CxPaginationItem } from '@chassis-ui/react'

export const SmartExample = () => {
  const [page, setPage] = useState(1)
  return <CxPagination pages={10} activePage={page} onActivePageChange={setPage} aria-label="Demo" />
}

import React from 'react'
import { useState } from 'react'
import { CxPagination, CxPaginationItem } from '@chassis-ui/react'

export const MaxVisibleExample = () => {
  const [page, setPage] = useState(5)
  return <CxPagination pages={20} activePage={page} onActivePageChange={setPage} maxVisiblePages={7} aria-label="Demo" />
}

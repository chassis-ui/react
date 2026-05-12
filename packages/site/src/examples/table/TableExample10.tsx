import React from 'react'
import {
  CxTable,
  CxTableBody,
  CxTableCaption,
  CxTableDataCell,
  CxTableFoot,
  CxTableHead,
  CxTableHeaderCell,
  CxTableRow,
} from '@chassis-ui/react'

export const TableExample10 = () => (

  <CxTable
    context="primary"
    items={[
      { id: 1, first_name: 'Mark', last_name: 'Otto', handle: '@mdo' },
      { id: 2, first_name: 'Jacob', last_name: 'Thornton', handle: '@fat' },
    ]}
  />
)

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

export const TableExample3 = () => (

  <CxTable
    responsive
    items={[
      { id: 1, first_name: 'Mark', last_name: 'Otto', handle: '@mdo', role: 'Admin', status: 'Active', joined: '2020-01-15' },
      { id: 2, first_name: 'Jacob', last_name: 'Thornton', handle: '@fat', role: 'Editor', status: 'Active', joined: '2021-03-22' },
      { id: 3, first_name: 'Larry', last_name: 'Bird', handle: '@twitter', role: 'Viewer', status: 'Inactive', joined: '2019-07-08' },
    ]}
  />
)

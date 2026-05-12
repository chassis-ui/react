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

export const TableExample2 = () => (

  <CxTable
    columns={[
      { key: 'id', label: '#' },
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      {
        key: 'handle',
        label: 'Username',
        render: (value) => <strong>{value}</strong>,
      },
    ]}
    items={[
      { id: 1, first_name: 'Mark', last_name: 'Otto', handle: '@mdo' },
      { id: 2, first_name: 'Jacob', last_name: 'Thornton', handle: '@fat' },
      { id: 3, first_name: 'Larry', last_name: 'Bird', handle: '@twitter' },
    ]}
  />
)

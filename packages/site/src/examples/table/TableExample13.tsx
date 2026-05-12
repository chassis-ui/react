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

export const TableExample13 = () => (

  <CxTable caption="top">
    <CxTableCaption>List of users</CxTableCaption>
    <CxTableHead>
      <CxTableRow>
        <CxTableHeaderCell scope="col">#</CxTableHeaderCell>
        <CxTableHeaderCell scope="col">First</CxTableHeaderCell>
        <CxTableHeaderCell scope="col">Last</CxTableHeaderCell>
        <CxTableHeaderCell scope="col">Handle</CxTableHeaderCell>
      </CxTableRow>
    </CxTableHead>
    <CxTableBody>
      <CxTableRow>
        <CxTableHeaderCell scope="row">1</CxTableHeaderCell>
        <CxTableDataCell>Mark</CxTableDataCell>
        <CxTableDataCell>Otto</CxTableDataCell>
        <CxTableDataCell>@mdo</CxTableDataCell>
      </CxTableRow>
    </CxTableBody>
  </CxTable>
)

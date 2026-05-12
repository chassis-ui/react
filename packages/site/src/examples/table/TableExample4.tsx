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

export const TableExample4 = () => (

  <CxTable>
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
      <CxTableRow>
        <CxTableHeaderCell scope="row">2</CxTableHeaderCell>
        <CxTableDataCell>Jacob</CxTableDataCell>
        <CxTableDataCell>Thornton</CxTableDataCell>
        <CxTableDataCell>@fat</CxTableDataCell>
      </CxTableRow>
      <CxTableRow>
        <CxTableHeaderCell scope="row">3</CxTableHeaderCell>
        <CxTableDataCell>Larry</CxTableDataCell>
        <CxTableDataCell>Bird</CxTableDataCell>
        <CxTableDataCell>@twitter</CxTableDataCell>
      </CxTableRow>
    </CxTableBody>
  </CxTable>
)

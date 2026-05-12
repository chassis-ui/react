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

export const TableExample14 = () => (

  <CxTable responsive>
    <CxTableHead>
      <CxTableRow>
        <CxTableHeaderCell scope="col">#</CxTableHeaderCell>
        <CxTableHeaderCell scope="col">Heading</CxTableHeaderCell>
        <CxTableHeaderCell scope="col">Heading</CxTableHeaderCell>
        <CxTableHeaderCell scope="col">Heading</CxTableHeaderCell>
        <CxTableHeaderCell scope="col">Heading</CxTableHeaderCell>
        <CxTableHeaderCell scope="col">Heading</CxTableHeaderCell>
        <CxTableHeaderCell scope="col">Heading</CxTableHeaderCell>
        <CxTableHeaderCell scope="col">Heading</CxTableHeaderCell>
        <CxTableHeaderCell scope="col">Heading</CxTableHeaderCell>
      </CxTableRow>
    </CxTableHead>
    <CxTableBody>
      <CxTableRow>
        <CxTableHeaderCell scope="row">1</CxTableHeaderCell>
        <CxTableDataCell>Cell</CxTableDataCell>
        <CxTableDataCell>Cell</CxTableDataCell>
        <CxTableDataCell>Cell</CxTableDataCell>
        <CxTableDataCell>Cell</CxTableDataCell>
        <CxTableDataCell>Cell</CxTableDataCell>
        <CxTableDataCell>Cell</CxTableDataCell>
        <CxTableDataCell>Cell</CxTableDataCell>
        <CxTableDataCell>Cell</CxTableDataCell>
      </CxTableRow>
    </CxTableBody>
  </CxTable>
)

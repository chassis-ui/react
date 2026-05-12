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

export const TableExample11 = () => (

  <CxTable>
    <CxTableHead>
      <CxTableRow>
        <CxTableHeaderCell scope="col">Context</CxTableHeaderCell>
        <CxTableHeaderCell scope="col">Column</CxTableHeaderCell>
        <CxTableHeaderCell scope="col">Column</CxTableHeaderCell>
      </CxTableRow>
    </CxTableHead>
    <CxTableBody>
      <CxTableRow context="primary">
        <CxTableHeaderCell scope="row">Primary</CxTableHeaderCell>
        <CxTableDataCell>Cell</CxTableDataCell>
        <CxTableDataCell>Cell</CxTableDataCell>
      </CxTableRow>
      <CxTableRow context="secondary">
        <CxTableHeaderCell scope="row">Secondary</CxTableHeaderCell>
        <CxTableDataCell>Cell</CxTableDataCell>
        <CxTableDataCell>Cell</CxTableDataCell>
      </CxTableRow>
      <CxTableRow context="success">
        <CxTableHeaderCell scope="row">Success</CxTableHeaderCell>
        <CxTableDataCell>Cell</CxTableDataCell>
        <CxTableDataCell>Cell</CxTableDataCell>
      </CxTableRow>
      <CxTableRow context="danger">
        <CxTableHeaderCell scope="row">Danger</CxTableHeaderCell>
        <CxTableDataCell>Cell</CxTableDataCell>
        <CxTableDataCell>Cell</CxTableDataCell>
      </CxTableRow>
      <CxTableRow context="warning">
        <CxTableHeaderCell scope="row">Warning</CxTableHeaderCell>
        <CxTableDataCell>Cell</CxTableDataCell>
        <CxTableDataCell>Cell</CxTableDataCell>
      </CxTableRow>
      <CxTableRow context="info">
        <CxTableHeaderCell scope="row">Info</CxTableHeaderCell>
        <CxTableDataCell>Cell</CxTableDataCell>
        <CxTableDataCell>Cell</CxTableDataCell>
      </CxTableRow>
    </CxTableBody>
  </CxTable>
)

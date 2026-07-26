import React from 'react'
import {
  CxTable,
  CxTableBody,
  CxTableCell,
  CxTableColumn,
  CxTableHeader,
  CxTableRow
} from '@chassis-ui/react'

export const BasicExample = () => (
  <CxTable aria-label="Users">
    <CxTableHeader>
      <CxTableColumn key="firstName">First name</CxTableColumn>
      <CxTableColumn key="lastName">Last name</CxTableColumn>
      <CxTableColumn key="handle">Username</CxTableColumn>
    </CxTableHeader>
    <CxTableBody>
      <CxTableRow>
        <CxTableCell>Mark</CxTableCell>
        <CxTableCell>Otto</CxTableCell>
        <CxTableCell>@mdo</CxTableCell>
      </CxTableRow>
      <CxTableRow>
        <CxTableCell>Jacob</CxTableCell>
        <CxTableCell>Thornton</CxTableCell>
        <CxTableCell>@fat</CxTableCell>
      </CxTableRow>
      <CxTableRow>
        <CxTableCell>Larry</CxTableCell>
        <CxTableCell>Bird</CxTableCell>
        <CxTableCell>@twitter</CxTableCell>
      </CxTableRow>
    </CxTableBody>
  </CxTable>
)

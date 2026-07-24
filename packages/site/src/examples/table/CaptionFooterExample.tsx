import React from 'react'
import {
  CxTable,
  CxTableBody,
  CxTableCell,
  CxTableColumn,
  CxTableHeader,
  CxTableRow,
} from '@chassis-ui/react'

const rows = [
  { id: 1, name: 'Mark Otto', amount: '$120' },
  { id: 2, name: 'Jacob Thornton', amount: '$80' },
]

export const CaptionFooterExample = () => (
  <CxTable
    aria-label="Invoices"
    caption="Recent invoices"
    footer={
      <tr>
        <td>Total</td>
        <td>$200</td>
      </tr>
    }
  >
    <CxTableHeader>
      <CxTableColumn key="name">Name</CxTableColumn>
      <CxTableColumn key="amount">Amount</CxTableColumn>
    </CxTableHeader>
    <CxTableBody items={rows}>
      {(row) => (
        <CxTableRow key={row.id}>
          {(columnKey) => <CxTableCell>{row[columnKey as keyof typeof row]}</CxTableCell>}
        </CxTableRow>
      )}
    </CxTableBody>
  </CxTable>
)

import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridColumn,
  DataGridHeader,
  DataGridRow
} from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'

// Static rows only: `DataGridBody`'s `items` with a render function can't be passed from a
// Server Component, as no function can.
export default function Page() {
  return (
    <main>
      <DataGrid aria-label="People" rowHeight={40}>
        <DataGridHeader>
          <DataGridColumn isRowHeader>Name</DataGridColumn>
          <DataGridColumn pin="end">Role</DataGridColumn>
        </DataGridHeader>
        <DataGridBody>
          <DataGridRow>
            <DataGridCell>Mark</DataGridCell>
            <DataGridCell>
              Engineer <ClientMark />
            </DataGridCell>
          </DataGridRow>
        </DataGridBody>
      </DataGrid>
    </main>
  )
}

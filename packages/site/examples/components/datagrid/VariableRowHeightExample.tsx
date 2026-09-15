import {
  DataGrid,
  DataGridHeader,
  DataGridColumn,
  DataGridBody,
  DataGridRow,
  DataGridCell
} from '@chassis-ui/react'

const rows = [
  {
    id: 1,
    name: 'Mark Otto',
    bio: 'Co-founder, focused on design systems and component APIs.'
  },
  {
    id: 2,
    name: 'Jacob Thornton',
    bio: 'Co-founder.'
  },
  {
    id: 3,
    name: 'Larry Bird',
    bio: 'Handles onboarding docs and the getting-started guide — writes most of the long-form tutorial content, keeps the changelog current, and reviews every doc PR before it merges.'
  }
]

export const Example = () => (
  <DataGrid aria-label="Team" bordered estimatedRowHeight={48} rowHeight="auto">
    <DataGridHeader>
      <DataGridColumn defaultWidth={160} isRowHeader>
        Name
      </DataGridColumn>
      <DataGridColumn>Bio</DataGridColumn>
    </DataGridHeader>
    <DataGridBody items={rows}>
      {(row) => (
        <DataGridRow id={row.id}>
          <DataGridCell>{row.name}</DataGridCell>
          <DataGridCell>{row.bio}</DataGridCell>
        </DataGridRow>
      )}
    </DataGridBody>
  </DataGrid>
)

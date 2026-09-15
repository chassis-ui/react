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
    bio: 'Co-founder, focused on design systems and component APIs.',
    notes: 'Prefers async review over live meetings.',
    location: 'Boston, MA',
    role: 'Engineer',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Jacob Thornton',
    bio: 'Co-founder, works across the build pipeline and tooling.',
    notes: 'Owns the release process.',
    location: 'San Francisco, CA',
    role: 'Engineer',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Larry Bird',
    bio: 'Handles onboarding docs and the getting-started guide.',
    notes: 'Out most Fridays.',
    location: 'Springfield, IL',
    role: 'Writer',
    status: 'Inactive'
  }
]

export const Example = () => (
  <DataGrid aria-label="Team" bordered rowHeight={44}>
    <DataGridHeader>
      <DataGridColumn defaultWidth={160} isRowHeader pin="start">
        Name
      </DataGridColumn>
      <DataGridColumn defaultWidth={280}>Bio</DataGridColumn>
      <DataGridColumn defaultWidth={220}>Notes</DataGridColumn>
      <DataGridColumn defaultWidth={200}>Location</DataGridColumn>
      <DataGridColumn defaultWidth={120}>Role</DataGridColumn>
      <DataGridColumn defaultWidth={100} pin="end">
        Status
      </DataGridColumn>
    </DataGridHeader>
    <DataGridBody items={rows}>
      {(row) => (
        <DataGridRow id={row.id}>
          <DataGridCell>{row.name}</DataGridCell>
          <DataGridCell>{row.bio}</DataGridCell>
          <DataGridCell>{row.notes}</DataGridCell>
          <DataGridCell>{row.location}</DataGridCell>
          <DataGridCell>{row.role}</DataGridCell>
          <DataGridCell>{row.status}</DataGridCell>
        </DataGridRow>
      )}
    </DataGridBody>
  </DataGrid>
)

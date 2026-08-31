import { useMemo, useState, type ChangeEvent } from 'react'
import {
  TextInput,
  Select,
  DatePicker,
  Table,
  Badge,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@chassis-ui/react'
import { parseDate, type DateValue } from '@internationalized/date'

const allUsers = [
  { id: 1, name: 'Alice Martin', role: 'Admin', status: 'Active', joined: '2022-01-10' },
  { id: 2, name: 'Bob Chen', role: 'Editor', status: 'Active', joined: '2022-06-22' },
  { id: 3, name: 'Carol White', role: 'Viewer', status: 'Inactive', joined: '2023-02-14' },
  { id: 4, name: 'David Kim', role: 'Editor', status: 'Active', joined: '2023-09-01' },
  { id: 5, name: 'Eve Torres', role: 'Viewer', status: 'Active', joined: '2024-03-30' },
  { id: 6, name: 'Frank Lee', role: 'Admin', status: 'Inactive', joined: '2024-11-05' }
]

const roles = ['Admin', 'Editor', 'Viewer']
const statuses = ['Active', 'Inactive']
const statusColor = { Active: 'success', Inactive: 'secondary' } as const

const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  {
    key: 'status',
    label: 'Status',
    render: (v: string) => <Badge color={statusColor[v as keyof typeof statusColor]}>{v}</Badge>
  },
  { key: 'joined', label: 'Joined', render: (v: string) => dateFormatter.format(new Date(v)) }
]

export const Example = () => {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [joinedAfter, setJoinedAfter] = useState<DateValue | null>(null)

  const rows = useMemo(() => {
    const q = name.trim().toLowerCase()
    return allUsers.filter((user) => {
      if (q && !user.name.toLowerCase().includes(q)) return false
      if (role && user.role !== role) return false
      if (status && user.status !== status) return false
      if (joinedAfter && parseDate(user.joined).compare(joinedAfter) < 0) return false
      return true
    })
  }, [name, role, status, joinedAfter])

  const handleSelectChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLSelectElement>) =>
      setter(e.target.value)

  return (
    <div>
      <div className="d-flex flex-wrap gap-3 mb-3">
        <TextInput
          type="search"
          label="Name"
          size="small"
          placeholder="Search by name"
          value={name}
          onChange={setName}
          style={{ width: 200 }}
        />
        <Select
          label="Role"
          size="small"
          value={role}
          onChange={handleSelectChange(setRole)}
          style={{ width: 160 }}
          options={[
            { label: 'All roles', value: '' },
            ...roles.map((r) => ({ label: r, value: r }))
          ]}
        />
        <Select
          label="Status"
          size="small"
          value={status}
          onChange={handleSelectChange(setStatus)}
          style={{ width: 160 }}
          options={[
            { label: 'All statuses', value: '' },
            ...statuses.map((s) => ({ label: s, value: s }))
          ]}
        />
        <DatePicker
          label="Joined after"
          size="small"
          value={joinedAfter}
          onChange={setJoinedAfter}
          style={{ width: 200 }}
        />
      </div>
      <Table aria-label="Users" hover>
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
          {(row) => (
            <TableRow key={row.id}>
              {(columnKey) => {
                const column = columns.find((c) => c.key === columnKey)
                const value = row[columnKey as keyof typeof row]
                return (
                  <TableCell>{column?.render ? column.render(String(value)) : value}</TableCell>
                )
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {rows.length === 0 && (
        <p className="text-secondary mt-3 mb-0">No users match these filters.</p>
      )}
    </div>
  )
}

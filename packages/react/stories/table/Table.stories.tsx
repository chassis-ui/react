import React, { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Selection, SortDescriptor } from 'react-stately'
import { expect } from 'storybook/test'

import { Table } from '../../src/components/table/Table'
import { TableHeader } from '../../src/components/table/TableHeader'
import { TableColumn } from '../../src/components/table/TableColumn'
import { TableBody } from '../../src/components/table/TableBody'
import { TableRow } from '../../src/components/table/TableRow'
import { TableCell } from '../../src/components/table/TableCell'

const meta: Meta<typeof Table> = {
  component: Table,
  title: 'table/Table'
}

export default meta

type Story = StoryObj<typeof Table>

const rows = [
  { id: 1, name: 'Mark Otto', role: 'Engineer' },
  { id: 2, name: 'Jacob Thornton', role: 'Designer' },
  { id: 3, name: 'Larry Bird', role: 'Engineer' }
]

export const Default: Story = {
  render: () => (
    <Table aria-label="Users">
      <TableHeader>
        <TableColumn key="firstName">First name</TableColumn>
        <TableColumn key="lastName">Last name</TableColumn>
        <TableColumn key="handle">Username</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Mark</TableCell>
          <TableCell>Otto</TableCell>
          <TableCell>@mdo</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jacob</TableCell>
          <TableCell>Thornton</TableCell>
          <TableCell>@fat</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Larry</TableCell>
          <TableCell>Bird</TableCell>
          <TableCell>@twitter</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export const Variants: Story = {
  render: () => (
    <Table aria-label="Team" bordered hover sm striped>
      <TableHeader>
        <TableColumn key="name">Name</TableColumn>
        <TableColumn key="role">Role</TableColumn>
      </TableHeader>
      <TableBody items={rows}>
        {(row) => (
          <TableRow key={row.id}>
            {(columnKey) => <TableCell>{row[columnKey as keyof typeof row]}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export const Sorting: Story = {
  render: function SortingTable() {
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
      column: 'name',
      direction: 'ascending'
    })

    const sortedRows = useMemo(() => {
      const key = sortDescriptor.column as keyof (typeof rows)[number]
      const sorted = [...rows].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0))
      return sortDescriptor.direction === 'descending' ? sorted.reverse() : sorted
    }, [sortDescriptor])

    return (
      <Table aria-label="Team" onSortChange={setSortDescriptor} sortDescriptor={sortDescriptor}>
        <TableHeader>
          <TableColumn key="name" allowsSorting>
            Name
          </TableColumn>
          <TableColumn key="role" allowsSorting>
            Role
          </TableColumn>
        </TableHeader>
        <TableBody items={sortedRows}>
          {(row) => (
            <TableRow key={row.id}>
              {(columnKey) => <TableCell>{row[columnKey as keyof typeof row]}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  },
  play: async function ({ canvas, userEvent }) {
    const roleHeader = canvas.getByRole('columnheader', { name: /role/i })
    await userEvent.click(roleHeader)
    await expect(roleHeader).toHaveAttribute('aria-sort', 'ascending')
  }
}

export const RowSelection: Story = {
  render: function SelectionTable() {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())
    return (
      <Table
        aria-label="Team"
        onSelectionChange={setSelectedKeys}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
      >
        <TableHeader>
          <TableColumn key="name">Name</TableColumn>
          <TableColumn key="role">Role</TableColumn>
        </TableHeader>
        <TableBody items={rows}>
          {(row) => (
            <TableRow key={row.id}>
              {(columnKey) => <TableCell>{row[columnKey as keyof typeof row]}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  },
  play: async function ({ canvas, userEvent }) {
    const selectAll = canvas.getByRole('checkbox', { name: /select all/i })
    await userEvent.click(selectAll)
    await expect(selectAll).toBeChecked()
  }
}

export const Responsive: Story = {
  render: () => (
    <Table aria-label="Team" responsive stacked="md">
      <TableHeader>
        <TableColumn key="name">Name</TableColumn>
        <TableColumn key="role">Role</TableColumn>
      </TableHeader>
      <TableBody items={rows}>
        {(row) => (
          <TableRow key={row.id}>
            {(columnKey) => <TableCell>{row[columnKey as keyof typeof row]}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

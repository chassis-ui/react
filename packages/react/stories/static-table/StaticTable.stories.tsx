import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { StaticTable } from '../../src/components/static-table/StaticTable'

const meta: Meta<typeof StaticTable> = {
  component: StaticTable,
  title: 'static-table/StaticTable'
}

export default meta

type Story = StoryObj<typeof StaticTable>

const rows = [
  { id: 1, name: 'Mark Otto', role: 'Engineer', handle: 'mdo' },
  { id: 2, name: 'Jacob Thornton', role: 'Designer', handle: 'fat' },
  { id: 3, name: 'Larry Bird', role: 'Engineer', handle: 'twitter' }
]

// `StaticTable` renders the markup it's given, so the rows are plain elements, links included:
// the listings it exists for are server-rendered rows that link somewhere.
const Rows = () => (
  <>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Role</th>
        <th scope="col">Profile</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.id}>
          <td data-cell="Name">{row.name}</td>
          <td data-cell="Role">{row.role}</td>
          <td data-cell="Profile">
            <a href={`#${row.handle}`}>@{row.handle}</a>
          </td>
        </tr>
      ))}
    </tbody>
  </>
)

export const Default: Story = {
  args: { 'aria-label': 'Users' },
  render: (args) => (
    <StaticTable {...args}>
      <Rows />
    </StaticTable>
  ),
  play: async function ({ canvas }) {
    const table = canvas.getByRole('table', { name: 'Users' })
    await expect(table).toHaveClass('table')
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(3)
    await expect(canvas.getAllByRole('row')).toHaveLength(4)
    await expect(canvas.getByRole('link', { name: '@mdo' })).toHaveAttribute('href', '#mdo')
    // A plain table, not `Table`'s grid: nothing in it takes focus but the links.
    await expect(canvas.queryByRole('grid')).not.toBeInTheDocument()
  }
}

export const Variants: Story = {
  args: { 'aria-label': 'Team', bordered: true, hover: true, sm: true, striped: true },
  render: Default.render,
  play: async function ({ canvas }) {
    await expect(canvas.getByRole('table', { name: 'Team' })).toHaveClass(
      'table',
      'bordered',
      'hoverable',
      'sm',
      'striped'
    )
  }
}

export const Colored: Story = {
  args: { 'aria-label': 'Team', color: 'primary' },
  render: Default.render,
  play: async function ({ canvas }) {
    const table = canvas.getByRole('table', { name: 'Team' })
    await expect(table).toHaveClass('table', 'primary', 'context')
    // The color reaches the cells: a default table's are not tinted.
    const cell = canvas.getByRole('cell', { name: 'Mark Otto' })
    await expect(getComputedStyle(cell).color).not.toBe(getComputedStyle(document.body).color)
  }
}

export const CaptionAndFooter: Story = {
  args: { caption: 'Team members' },
  render: (args) => (
    <StaticTable {...args}>
      <Rows />
      <tfoot>
        <tr>
          <td colSpan={3}>3 members</td>
        </tr>
      </tfoot>
    </StaticTable>
  ),
  play: async function ({ canvas }) {
    await expect(canvas.getByRole('table', { name: 'Team members' })).toBeVisible()
    await expect(canvas.getByRole('cell', { name: '3 members' })).toBeVisible()
  }
}

export const Responsive: Story = {
  args: { 'aria-label': 'Users', responsive: true },
  render: Default.render
}

// Unlike `Table`, which labels each stacked cell from its column header, a static table has no
// collection to read labels from: each `<td>` carries its own `data-cell`.
export const Stacked: Story = {
  args: { 'aria-label': 'Users', stacked: 'md' },
  render: Default.render,
  play: async function ({ canvas }) {
    await expect(canvas.getByRole('table', { name: 'Users' })).toHaveClass('max-md:stacked')
    await expect(canvas.getAllByRole('cell')[0]).toHaveAttribute('data-cell', 'Name')
  }
}

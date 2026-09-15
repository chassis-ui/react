import React, { useEffect, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Selection, SortDescriptor } from 'react-aria-components'

import { DataGrid } from '../../src/components/datagrid/DataGrid'
import { DataGridBody } from '../../src/components/datagrid/DataGridBody'
import { DataGridCell } from '../../src/components/datagrid/DataGridCell'
import { DataGridColumn } from '../../src/components/datagrid/DataGridColumn'
import { DataGridHeader } from '../../src/components/datagrid/DataGridHeader'
import { DataGridRow } from '../../src/components/datagrid/DataGridRow'
import {
  DataGridSelectAllCell,
  DataGridSelectionCell
} from '../../src/components/datagrid/DataGridSelectionCell'

const meta: Meta<typeof DataGrid> = {
  component: DataGrid,
  title: 'datagrid/DataGrid'
}
export default meta

type Story = StoryObj<typeof DataGrid>

interface Item {
  id: number
  name: string
  role: string
  status: string
}

const items: Item[] = Array.from({ length: 500 }, (_, id) => ({
  id,
  name: `Person ${id}`,
  role: ['Engineer', 'Designer', 'Manager'][id % 3],
  status: id % 5 === 0 ? 'Inactive' : 'Active'
}))

export const Default: Story = {
  args: {
    'aria-label': 'People',
    rowHeight: 40,
    children: [
      <DataGridHeader key="header">
        <DataGridColumn isRowHeader>Name</DataGridColumn>
        <DataGridColumn>Role</DataGridColumn>
        <DataGridColumn>Status</DataGridColumn>
      </DataGridHeader>,
      <DataGridBody key="body" items={items}>
        {(item: Item) => (
          <DataGridRow>
            <DataGridCell>{item.name}</DataGridCell>
            <DataGridCell>{item.role}</DataGridCell>
            <DataGridCell>{item.status}</DataGridCell>
          </DataGridRow>
        )}
      </DataGridBody>
    ]
  }
}

export const Bordered: Story = {
  args: { ...Default.args, bordered: true }
}

export const PinnedColumns: Story = {
  args: {
    'aria-label': 'People',
    bordered: true,
    rowHeight: 40,
    children: [
      <DataGridHeader key="header">
        <DataGridColumn defaultWidth={80} isRowHeader minWidth={80} pin="start">
          Id
        </DataGridColumn>
        <DataGridColumn defaultWidth={160} minWidth={160}>
          Name
        </DataGridColumn>
        <DataGridColumn defaultWidth={300} minWidth={300}>
          Bio
        </DataGridColumn>
        <DataGridColumn defaultWidth={300} minWidth={300}>
          Notes
        </DataGridColumn>
        <DataGridColumn defaultWidth={300} minWidth={300}>
          Address
        </DataGridColumn>
        <DataGridColumn defaultWidth={140} minWidth={140}>
          Role
        </DataGridColumn>
        <DataGridColumn defaultWidth={120} minWidth={120} pin="end">
          Status
        </DataGridColumn>
      </DataGridHeader>,
      <DataGridBody key="body" items={items}>
        {(item: Item) => (
          <DataGridRow>
            <DataGridCell>{item.id}</DataGridCell>
            <DataGridCell>{item.name}</DataGridCell>
            <DataGridCell>Bio text for {item.name} goes here, long enough to scroll.</DataGridCell>
            <DataGridCell>Some notes about {item.name} for this row.</DataGridCell>
            <DataGridCell>1{item.id} Example St, Springfield</DataGridCell>
            <DataGridCell>{item.role}</DataGridCell>
            <DataGridCell>{item.status}</DataGridCell>
          </DataGridRow>
        )}
      </DataGridBody>
    ]
  }
}

const bios = [
  'Short bio.',
  'A md-length bio that will likely wrap onto a second line at this column width.',
  'A much longer bio, deliberately uneven so this row measures taller than its neighbors — ' +
    'enough text to wrap across three or four lines and prove rows are sized to their own ' +
    'content instead of a single fixed height shared by every row in the grid.',
  'Another short one.'
]

export const VariableRowHeight: Story = {
  args: {
    'aria-label': 'People',
    bordered: true,
    estimatedRowHeight: 40,
    rowHeight: 'auto',
    children: [
      <DataGridHeader key="header">
        <DataGridColumn defaultWidth={160} isRowHeader minWidth={160}>
          Name
        </DataGridColumn>
        <DataGridColumn minWidth={400}>Bio</DataGridColumn>
      </DataGridHeader>,
      <DataGridBody key="body" items={items.slice(0, 50)}>
        {(item: Item) => (
          <DataGridRow>
            <DataGridCell>{item.name}</DataGridCell>
            <DataGridCell>{bios[item.id % bios.length]}</DataGridCell>
          </DataGridRow>
        )}
      </DataGridBody>
    ]
  }
}

const PAGE_SIZE = 30

export const AsyncLoading: Story = {
  render: (args) => {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
    const [isLoading, setIsLoading] = useState(false)

    const onLoadMore = () => {
      if (visibleCount >= items.length) return
      setIsLoading(true)
      // Simulates a network delay — a real app would fetch the next page here instead.
      setTimeout(() => {
        setVisibleCount((count) => Math.min(count + PAGE_SIZE, items.length))
        setIsLoading(false)
      }, 1000)
    }

    return (
      <DataGrid {...args}>
        <DataGridHeader>
          <DataGridColumn isRowHeader>Name</DataGridColumn>
          <DataGridColumn>Role</DataGridColumn>
          <DataGridColumn>Status</DataGridColumn>
        </DataGridHeader>
        <DataGridBody
          isLoading={isLoading}
          items={items.slice(0, visibleCount)}
          loadingContent="Loading more…"
          onLoadMore={visibleCount < items.length ? onLoadMore : undefined}
        >
          {(item: Item) => (
            <DataGridRow>
              <DataGridCell>{item.name}</DataGridCell>
              <DataGridCell>{item.role}</DataGridCell>
              <DataGridCell>{item.status}</DataGridCell>
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    )
  },
  args: {
    'aria-label': 'People',
    rowHeight: 40
  }
}

export const SortableAndSelectable: Story = {
  render: (args) => {
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
      column: 'name',
      direction: 'ascending'
    })
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())

    const sorted = [...items].sort((a, b) => {
      const dir = sortDescriptor.direction === 'ascending' ? 1 : -1
      const key = sortDescriptor.column as keyof Item
      return String(a[key]).localeCompare(String(b[key])) * dir
    })

    return (
      <DataGrid
        {...args}
        hover
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
      >
        <DataGridHeader>
          <DataGridColumn className="datagrid-selection-cell" defaultWidth={44} minWidth={44}>
            <DataGridSelectAllCell />
          </DataGridColumn>
          <DataGridColumn isRowHeader allowsSorting id="name">
            Name
          </DataGridColumn>
          <DataGridColumn allowsSorting id="role">
            Role
          </DataGridColumn>
          <DataGridColumn allowsSorting id="status">
            Status
          </DataGridColumn>
        </DataGridHeader>
        <DataGridBody items={sorted}>
          {(item: Item) => (
            <DataGridRow id={item.id}>
              <DataGridCell className="datagrid-selection-cell">
                <DataGridSelectionCell />
              </DataGridCell>
              <DataGridCell>{item.name}</DataGridCell>
              <DataGridCell>{item.role}</DataGridCell>
              <DataGridCell>{item.status}</DataGridCell>
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    )
  },
  args: {
    'aria-label': 'People',
    rowHeight: 40
  }
}

export const FooterRow: Story = {
  args: {
    'aria-label': 'People',
    bordered: true,
    footer: `${items.length} people total`,
    rowHeight: 40,
    children: [
      <DataGridHeader key="header">
        <DataGridColumn isRowHeader>Name</DataGridColumn>
        <DataGridColumn>Role</DataGridColumn>
        <DataGridColumn>Status</DataGridColumn>
      </DataGridHeader>,
      <DataGridBody items={items} key="body">
        {(item: Item) => (
          <DataGridRow>
            <DataGridCell>{item.name}</DataGridCell>
            <DataGridCell>{item.role}</DataGridCell>
            <DataGridCell>{item.status}</DataGridCell>
          </DataGridRow>
        )}
      </DataGridBody>
    ]
  }
}

export const PinnedColumnsScrolled: Story = {
  render: (args) => {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
      const grid = ref.current
      if (!grid) return
      // Deferred two frames: at the moment this effect first runs, the virtualizer hasn't yet
      // settled its real layout (scrollWidth still equals clientWidth, even though every column
      // here has a static pixel width — the settling itself is tied to the browser's own
      // layout/paint cycle, not React's commit), so an immediate assignment silently clamps to 0.
      // Scrolling to a deliberately oversized value (rather than computing the exact max) is
      // itself clamped by the browser to whatever the real max turns out to be. Scrolling to the
      // true max, not just partway, also proves pin="start" and pin="end" stay put simultaneously
      // with scrolled-away unpinned columns visible between them — a partial scroll on a viewport
      // this wide can still leave pin="end"'s column just out of frame.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          grid.scrollLeft = 100_000
        })
      })
    }, [])
    return <DataGrid {...args} ref={ref} />
  },
  args: PinnedColumns.args
}

export const HeaderFooterScrolled: Story = {
  render: (args) => {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
      const grid = ref.current
      if (!grid) return
      // Deferred two frames — see PinnedColumnsScrolled's comment above for why an immediate
      // assignment races the virtualizer's own layout settling. A fixed, deterministic mid-scroll
      // position (500 rows * 40px rowHeight = 20000px of scrollable content) proves the header row
      // stays pinned to the top and the footer stays visible below the (unrelated, never-scrolled)
      // grid viewport at the same time.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          grid.scrollTop = 2000
        })
      })
    }, [])
    return <DataGrid {...args} ref={ref} />
  },
  args: FooterRow.args
}

export const LoadingRow: Story = {
  args: {
    'aria-label': 'People',
    rowHeight: 40,
    children: [
      <DataGridHeader key="header">
        <DataGridColumn isRowHeader>Name</DataGridColumn>
        <DataGridColumn>Role</DataGridColumn>
        <DataGridColumn>Status</DataGridColumn>
      </DataGridHeader>,
      // Static isLoading (no timer) so the loader row's content is deterministic for a screenshot,
      // unlike AsyncLoading above, whose loading state is only reachable via a real scroll-driven
      // fetch.
      <DataGridBody
        isLoading
        items={items.slice(0, 8)}
        key="body"
        loadingContent="Loading more…"
        onLoadMore={() => {}}
      >
        {(item: Item) => (
          <DataGridRow>
            <DataGridCell>{item.name}</DataGridCell>
            <DataGridCell>{item.role}</DataGridCell>
            <DataGridCell>{item.status}</DataGridCell>
          </DataGridRow>
        )}
      </DataGridBody>
    ]
  }
}

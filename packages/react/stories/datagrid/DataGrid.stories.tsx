import React, { useEffect, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Selection, SortDescriptor } from 'react-aria-components'
import { expect, waitFor } from 'storybook/test'

import { I18nProvider } from '../../src/index'
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

// Where an element is drawn, and the visible box of a grid: inside its borders and its scrollbar,
// which sits on the left under RTL. Pixels, not styles: a pinned column has been placed by a style
// that was right on paper and drawn somewhere else.
const box = (element: Element) => element.getBoundingClientRect()
const visibleBox = (grid: HTMLElement) => {
  const { left, right } = box(grid)
  return getComputedStyle(grid).direction === 'rtl'
    ? { left: right - grid.clientLeft - grid.clientWidth, right: right - grid.clientLeft }
    : { left: left + grid.clientLeft, right: left + grid.clientLeft + grid.clientWidth }
}

// Whether `element` is the one drawn at its own centre, not covered by a cell scrolled under it.
// Waited for: the browser hit-tests what it last painted, a frame behind a scroll.
const isOnTop = (element: Element) => {
  const { height, left, top, width } = box(element)
  return element.contains(document.elementFromPoint(left + width / 2, top + height / 2))
}

const scrollGrid = (grid: HTMLElement, left: number) => {
  grid.scrollLeft = left
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

// `color` paints the header, the rows, the selected row and the footer, which is a sibling of the
// grid and takes the color classes itself.
export const Colored: Story = {
  args: {
    ...FooterRow.args,
    color: 'primary',
    selectedKeys: new Set([1]),
    selectionMode: 'single'
  },
  play: async function ({ canvas }) {
    const grid = canvas.getByRole('grid', { name: 'People' })
    await expect(grid).toHaveClass('datagrid', 'primary', 'context')
    await expect(canvas.getByText(`${items.length} people total`)).toHaveClass(
      'datagrid-footer',
      'primary',
      'context'
    )
    // The color reaches the cells: a grid with no color has the page's text color.
    const cell = await canvas.findByRole('rowheader', { name: 'Person 0' })
    await expect(getComputedStyle(cell).color).not.toBe(getComputedStyle(document.body).color)
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
  args: PinnedColumns.args,
  // The scroll cue is a class on the cells of the boundary column and a rule of DataGrid.scss,
  // which only a browser applies. Scrolled to the end, content is hidden under `pin="start"`
  // alone.
  play: async function ({ canvas }) {
    const id = canvas.getByRole('columnheader', { name: 'Id' })
    const status = canvas.getByRole('columnheader', { name: 'Status' })
    await expect(id).toHaveClass('datagrid-pin-cue-start')
    await expect(status).toHaveClass('datagrid-pin-cue-end')
    await waitFor(() => expect(getComputedStyle(id).boxShadow).not.toBe('none'))
    await expect(getComputedStyle(canvas.getByRole('rowheader', { name: '0' })).boxShadow).not.toBe(
      'none'
    )
    await expect(getComputedStyle(status).boxShadow).toBe('none')
    // On the trailing edge of the start column, which content scrolls under, not its outer edge.
    await expect(getComputedStyle(id).boxShadow).toMatch(/\) -6px 0px/)
  }
}

// A column narrower than react-stately's own 75px minimum, and two columns in a fragment before an
// end-pinned one that nothing pushes off the grid: it stays where the layout put it, and the pin
// is read off the column that has it, not off a position in the header's children.
export const PinnedEndWithoutOverflow: Story = {
  render: (args) => (
    <div style={{ width: 800 }}>
      <DataGrid {...args} />
    </div>
  ),
  args: {
    'aria-label': 'People',
    bordered: true,
    rowHeight: 40,
    children: [
      <DataGridHeader key="header">
        <>
          <DataGridColumn isRowHeader>Name</DataGridColumn>
          <DataGridColumn defaultWidth={48}>Id</DataGridColumn>
        </>
        <DataGridColumn>Role</DataGridColumn>
        <DataGridColumn defaultWidth={100} pin="end">
          Status
        </DataGridColumn>
      </DataGridHeader>,
      <DataGridBody key="body" items={items}>
        {(item: Item) => (
          <DataGridRow>
            <DataGridCell>{item.name}</DataGridCell>
            <DataGridCell>{item.id}</DataGridCell>
            <DataGridCell>{item.role}</DataGridCell>
            <DataGridCell>{item.status}</DataGridCell>
          </DataGridRow>
        )}
      </DataGridBody>
    ]
  },
  play: async function ({ canvas }) {
    const grid = canvas.getByRole('grid', { name: 'People' })
    const header = (name: string) => canvas.getByRole('columnheader', { name })
    const [name, id, role, status] = [
      header('Name'),
      header('Id'),
      header('Role'),
      header('Status')
    ]
    await expect(grid.scrollWidth).toBe(grid.clientWidth)
    await waitFor(() => expect(box(status).right).toBeCloseTo(visibleBox(grid).right, 0))
    await expect(box(status).left).toBeCloseTo(box(role).right, 0)
    await expect(box(id).left).toBeCloseTo(box(name).right, 0)
    await expect(box(id).width).toBeCloseTo(75, 0)
    await expect(id).not.toHaveClass('datagrid-pin-cue-end')
    await expect(status).toHaveClass('datagrid-pin-cue-end')
  }
}

// A grid far narrower than its columns: the end-pinned column is in the DOM and drawn at the
// trailing edge, over the cells that scroll under it, before and after scrolling. Scrolled more
// than twice because Firefox used to lose the start-pinned header on the third scroll (see the
// header wrapper's `contain` in DataGrid.scss).
export const PinnedColumnsNarrow: Story = {
  render: (args) => (
    <div style={{ width: 600 }}>
      <DataGrid {...args} />
    </div>
  ),
  args: PinnedColumns.args,
  // Wide enough for the 600px grid: `isOnTop` reads what is drawn, which is nothing off-screen.
  globals: { viewport: { value: 'tablet', isRotated: false } },
  play: async function ({ canvas }) {
    const grid = canvas.getByRole('grid', { name: 'People' })
    const id = canvas.getByRole('columnheader', { name: 'Id' })
    const status = await canvas.findByRole('columnheader', { name: 'Status' })
    // Row 0's Status cell: every fifth person is inactive, and person 0 is the first.
    const cell = (await canvas.findAllByRole('gridcell', { name: 'Inactive' }))[0]!
    for (const left of [0, 300, 0, 500]) {
      scrollGrid(grid, left)
      await waitFor(() => expect(Math.abs(grid.scrollLeft)).toBeCloseTo(left, 0))
      await waitFor(() => expect(box(status).right).toBeCloseTo(visibleBox(grid).right, 0))
      await expect(box(cell).right).toBeCloseTo(visibleBox(grid).right, 0)
      await waitFor(() => expect(box(id).left).toBeCloseTo(visibleBox(grid).left, 0))
      await waitFor(() => expect(isOnTop(status)).toBe(true))
      await waitFor(() => expect(isOnTop(cell)).toBe(true))
    }
    // On the leading edge of the end column, which content scrolls under.
    await waitFor(() => expect(getComputedStyle(status).boxShadow).toMatch(/\) 6px 0px/))
  }
}

// The same under RTL, where the start is on the right, the end on the left and the browser counts
// `scrollLeft` down from 0.
export const PinnedColumnsRightToLeft: Story = {
  render: (args) => (
    <I18nProvider locale="ar-EG">
      <div dir="rtl" style={{ width: 600 }}>
        <DataGrid {...args} />
      </div>
    </I18nProvider>
  ),
  args: PinnedColumns.args,
  // Wide enough for the 600px grid: `isOnTop` reads what is drawn, which is nothing off-screen.
  globals: { viewport: { value: 'tablet', isRotated: false } },
  // Scrolled to the end, back to the start, then partway, where the screenshot is taken: the third
  // scroll is the one Firefox used to lose the start-pinned header on.
  play: async function ({ canvas }) {
    const grid = canvas.getByRole('grid', { name: 'People' })
    const id = canvas.getByRole('columnheader', { name: 'Id' })
    const status = await canvas.findByRole('columnheader', { name: 'Status' })
    await waitFor(() => expect(box(status).left).toBeCloseTo(visibleBox(grid).left, 0))
    await expect(box(id).right).toBeCloseTo(visibleBox(grid).right, 0)
    await waitFor(() => expect(isOnTop(status)).toBe(true))

    scrollGrid(grid, -100_000)
    await waitFor(() => expect(grid).not.toHaveClass('datagrid-scrolled-end'))
    await expect(grid).toHaveClass('datagrid-scrolled-start')
    await waitFor(() => expect(box(status).left).toBeCloseTo(visibleBox(grid).left, 0))
    await waitFor(() => expect(box(id).right).toBeCloseTo(visibleBox(grid).right, 0))

    scrollGrid(grid, 0)
    await waitFor(() => expect(grid).not.toHaveClass('datagrid-scrolled-start'))

    scrollGrid(grid, -300)
    await waitFor(() => expect(grid).toHaveClass('datagrid-scrolled-start'))
    await expect(grid).toHaveClass('datagrid-scrolled-end')
    await waitFor(() => expect(box(status).left).toBeCloseTo(visibleBox(grid).left, 0))
    await waitFor(() => expect(box(id).right).toBeCloseTo(visibleBox(grid).right, 0))
    await waitFor(() => expect(isOnTop(status)).toBe(true))
    await waitFor(() => expect(isOnTop(id)).toBe(true))
    // Each shadow on the edge content scrolls under: the left of the start, the right of the end.
    await expect(getComputedStyle(id).boxShadow).toMatch(/\) 6px 0px/)
    await expect(getComputedStyle(status).boxShadow).toMatch(/\) -6px 0px/)
  }
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

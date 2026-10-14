import * as React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridColumn,
  DataGridHeader,
  DataGridRow,
  I18nProvider
} from '../../../src/index'

// jsdom lays nothing out. react-aria's virtualizer renders every row and column there unless the
// prototype has its own `clientWidth`/`clientHeight`, which it reads as the viewport the browser
// would have given it; with them it windows, persists and positions as it does in a browser.
// Where a cell is drawn is the job of the stories' `play` functions, in three real browsers: these
// read the position the layout gives a cell's wrapper.
let viewport = { width: 800, height: 400 }

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => viewport.width
  })
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get: () => viewport.height
  })
  // A browser reports an observed element's size once after it is observed, so code that measures
  // on resize measures on mount; this stand-in does the same.
  vi.stubGlobal(
    'ResizeObserver',
    class {
      private connected = true

      constructor(private callback: ResizeObserverCallback) {}

      observe(target: Element) {
        setTimeout(() => {
          if (!this.connected) return
          this.callback(
            [{ target } as unknown as ResizeObserverEntry],
            this as unknown as ResizeObserver
          )
        })
      }

      unobserve() {}

      disconnect() {
        this.connected = false
      }
    }
  )
})

afterEach(() => {
  viewport = { width: 800, height: 400 }
  Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth')
  Reflect.deleteProperty(HTMLElement.prototype, 'clientHeight')
  vi.unstubAllGlobals()
})

interface Column {
  label: string
  defaultWidth?: number
  pin?: 'start' | 'end'
}

const rows = Array.from({ length: 20 }, (_, id) => ({ id }))

const PinnedGrid = ({ columns }: { columns: Column[] }) => (
  <DataGrid aria-label="People" rowHeight={40}>
    <DataGridHeader>
      {columns.map(({ defaultWidth, label, pin }, index) => (
        <DataGridColumn
          defaultWidth={defaultWidth}
          id={label}
          isRowHeader={index === 0}
          key={label}
          pin={pin}
        >
          {label}
        </DataGridColumn>
      ))}
    </DataGridHeader>
    <DataGridBody items={rows}>
      {(row) => (
        <DataGridRow id={row.id}>
          {columns.map(({ label }) => (
            <DataGridCell key={label}>{`${label} ${row.id}`}</DataGridCell>
          ))}
        </DataGridRow>
      )}
    </DataGridBody>
  </DataGrid>
)

// The columns of the `PinnedColumns` story: 1400px of them, the last pinned to the end.
const wideColumns: Column[] = [
  { label: 'Id', defaultWidth: 80, pin: 'start' },
  { label: 'Name', defaultWidth: 160 },
  { label: 'Bio', defaultWidth: 300 },
  { label: 'Notes', defaultWidth: 300 },
  { label: 'Address', defaultWidth: 300 },
  { label: 'Role', defaultWidth: 140 },
  { label: 'Status', defaultWidth: 120, pin: 'end' }
]

// The virtualizer's positioned wrapper around a cell: the innermost `role="presentation"` element
// that contains it.
const wrapperOf = (cell: HTMLElement) => {
  const wrappers = screen.getAllByRole('presentation').filter((element) => element.contains(cell))
  const wrapper = wrappers[wrappers.length - 1]
  if (!wrapper) throw new Error('The cell has no wrapper')
  return wrapper
}

// Lets anything a frame or a timer would still do to the wrappers happen before they are read. In
// rounds: an update made inside one `act` renders as it ends, and what that render schedules
// (an observer's report, a frame) runs in the next.
const settle = async () => {
  for (let round = 0; round < 3; round++) {
    await act(() => new Promise<void>((resolve) => setTimeout(resolve, 20)))
  }
}

const scrollGrid = (left: number) => {
  const grid = screen.getByRole('grid')
  Object.defineProperty(grid, 'scrollLeft', { configurable: true, value: left })
  fireEvent.scroll(grid)
}

describe('DataGrid pin="end"', () => {
  test('leaves an end-pinned column where the layout put it when nothing overflows', async () => {
    render(
      <PinnedGrid
        columns={[
          { label: 'Name' },
          { label: 'Role' },
          { label: 'Team' },
          { label: 'Status', defaultWidth: 100, pin: 'end' }
        ]}
      />
    )
    await settle()
    const wrapper = wrapperOf(screen.getByRole('columnheader', { name: 'Status' }))
    expect(wrapper).toHaveStyle({ left: '700px', width: '100px' })
    expect(wrapper.style.transform).toBe('')
  })

  test('places it after a column narrower than the 75px minimum', async () => {
    render(
      <PinnedGrid
        columns={[
          { label: 'Name', defaultWidth: 300 },
          { label: 'Id', defaultWidth: 48 },
          { label: 'Role', defaultWidth: 300 },
          { label: 'Status', defaultWidth: 100, pin: 'end' }
        ]}
      />
    )
    await settle()
    // Id is 75px wide, not 48, so Status starts at 675, inside the 800px grid.
    expect(wrapperOf(screen.getByRole('columnheader', { name: 'Id' }))).toHaveStyle({
      width: '75px'
    })
    const status = wrapperOf(screen.getByRole('columnheader', { name: 'Status' }))
    expect(status).toHaveStyle({ left: '675px' })
    expect(status.style.transform).toBe('')
  })

  test('mounts the end-pinned column at the trailing edge of a narrow grid', async () => {
    viewport = { width: 700, height: 400 }
    render(<PinnedGrid columns={wideColumns} />)
    await settle()
    // 1280px into the row, past what a 700px viewport and its overscan mount.
    expect(wrapperOf(screen.getByRole('columnheader', { name: 'Status' }))).toHaveStyle({
      left: '580px'
    })
    const cells = screen.getAllByRole('gridcell', { name: /^Status / })
    expect(cells.length).toBeGreaterThan(0)
    for (const cell of cells) {
      expect(wrapperOf(cell)).toHaveStyle({ left: '580px' })
      expect(wrapperOf(cell).style.transform).toBe('')
    }
  })

  test('keeps it at the trailing edge as the grid scrolls, and lets it go at the end', async () => {
    viewport = { width: 700, height: 400 }
    render(<PinnedGrid columns={wideColumns} />)
    await settle()
    const header = () => wrapperOf(screen.getByRole('columnheader', { name: 'Status' }))

    act(() => scrollGrid(300))
    await settle()
    expect(header()).toHaveStyle({ left: '880px' })
    expect(header().style.transform).toBe('')

    // Scrolled all the way, it is where the layout put it.
    act(() => scrollGrid(700))
    await settle()
    expect(header()).toHaveStyle({ left: '1280px' })
  })

  test('puts the end-pinned header above every header that scrolls under it', async () => {
    viewport = { width: 700, height: 400 }
    render(<PinnedGrid columns={wideColumns} />)
    await settle()
    const zIndexOf = (name: string) =>
      Number(wrapperOf(screen.getByRole('columnheader', { name })).style.zIndex)
    const status = zIndexOf('Status')
    for (const header of screen.getAllByRole('columnheader')) {
      const name = header.textContent ?? ''
      if (name !== 'Status') expect(zIndexOf(name)).toBeLessThan(status)
    }
  })

  test('reads the pin off the column that has it, through a fragment', async () => {
    render(
      <DataGrid aria-label="People" rowHeight={40}>
        <DataGridHeader>
          <>
            <DataGridColumn id="name" isRowHeader>
              Name
            </DataGridColumn>
            <DataGridColumn id="role">Role</DataGridColumn>
          </>
          <DataGridColumn defaultWidth={100} id="status" pin="end">
            Status
          </DataGridColumn>
        </DataGridHeader>
        <DataGridBody items={rows}>
          {(row) => (
            <DataGridRow id={row.id}>
              <DataGridCell>{`Name ${row.id}`}</DataGridCell>
              <DataGridCell>{`Role ${row.id}`}</DataGridCell>
              <DataGridCell>{`Status ${row.id}`}</DataGridCell>
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    )
    await settle()
    const role = screen.getByRole('columnheader', { name: 'Role' })
    const status = screen.getByRole('columnheader', { name: 'Status' })
    expect(status).toHaveClass('datagrid-pin-cue-end')
    expect(role).not.toHaveClass('datagrid-pin-cue-end')
    expect(wrapperOf(role).style.transform).toBe('')
    expect(wrapperOf(role)).toHaveStyle({ left: '350px' })
    expect(wrapperOf(status)).toHaveStyle({ left: '700px' })
  })

  test('pins a column of the `columns` render-function form', async () => {
    viewport = { width: 700, height: 400 }
    render(
      <DataGrid aria-label="People" rowHeight={40}>
        <DataGridHeader columns={wideColumns}>
          {(column) => (
            <DataGridColumn
              defaultWidth={column.defaultWidth}
              id={column.label}
              isRowHeader={column.label === 'Id'}
              pin={column.pin}
            >
              {column.label}
            </DataGridColumn>
          )}
        </DataGridHeader>
        <DataGridBody items={rows}>
          {(row) => (
            <DataGridRow columns={wideColumns} id={row.id}>
              {(column) => <DataGridCell>{`${column.label} ${row.id}`}</DataGridCell>}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    )
    await settle()
    const id = screen.getByRole('columnheader', { name: 'Id' })
    const status = screen.getByRole('columnheader', { name: 'Status' })
    expect(id).toHaveClass('datagrid-pin-cue-start')
    expect(status).toHaveClass('datagrid-pin-cue-end')
    expect(wrapperOf(id)).toHaveStyle({ position: 'sticky' })
    expect(wrapperOf(status)).toHaveStyle({ left: '580px' })
  })
})

describe('DataGrid pin="end" under RTL', () => {
  const renderRtl = () =>
    render(
      <I18nProvider locale="ar-EG">
        <div dir="rtl">
          <PinnedGrid columns={wideColumns} />
        </div>
      </I18nProvider>
    )

  test('positions the end-pinned column from the right, at the left edge', async () => {
    viewport = { width: 700, height: 400 }
    renderRtl()
    await settle()
    const wrapper = wrapperOf(screen.getByRole('columnheader', { name: 'Status' }))
    expect(wrapper).toHaveStyle({ right: '580px' })
    expect(wrapper.style.transform).toBe('')
  })

  test('marks the grid scrolled from the start, where scrollLeft counts down from 0', async () => {
    viewport = { width: 700, height: 400 }
    renderRtl()
    await settle()
    const grid = screen.getByRole('grid')
    Object.defineProperty(grid, 'scrollWidth', { configurable: true, value: 1400 })

    act(() => scrollGrid(-300))
    expect(grid).toHaveClass('datagrid-scrolled-start', 'datagrid-scrolled-end')

    act(() => scrollGrid(-700))
    expect(grid).toHaveClass('datagrid-scrolled-start')
    expect(grid).not.toHaveClass('datagrid-scrolled-end')
  })
})

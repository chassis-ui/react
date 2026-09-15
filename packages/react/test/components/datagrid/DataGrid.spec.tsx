import * as React from 'react'
import { act, render, screen, fireEvent, within } from '@testing-library/react'
import { axe } from 'jest-axe'

import {
  DataGrid,
  DataGridHeader,
  DataGridColumn,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridSelectAllCell,
  DataGridSelectionCell
} from '../../../src/index'

const rows = [
  { id: '1', name: 'Mark', username: '@mdo' },
  { id: '2', name: 'Jacob', username: '@fat' },
  { id: '3', name: 'Larry', username: '@twitter' }
]

// react-aria's virtualizer measures a mounted row/cell's `scrollHeight` to correct an estimated
// height (see `useVirtualizerItem`) — jsdom doesn't lay out content, so `scrollHeight` is always 0
// there unless a test stands in for the browser's real layout, same pattern `useColumnGeometry`'s
// own spec uses for `offsetLeft`/`offsetWidth`. `entries` has to be non-empty:
// react-aria's ResizeObserver callback bails out on an empty entries array.
class MockResizeObserver {
  static instances: MockResizeObserver[] = []
  callback: ResizeObserverCallback
  observed: Element[] = []

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    MockResizeObserver.instances.push(this)
  }

  observe(target: Element) {
    this.observed.push(target)
  }

  unobserve() {}

  disconnect() {
    this.observed = []
  }

  trigger() {
    const entries = this.observed.map((target) => ({ target }) as unknown as ResizeObserverEntry)
    this.callback(entries, this as unknown as ResizeObserver)
  }
}

interface BasicDataGridProps {
  disabledKeys?: React.ComponentProps<typeof DataGrid>['disabledKeys']
  onSelectionChange?: React.ComponentProps<typeof DataGrid>['onSelectionChange']
  onSortChange?: React.ComponentProps<typeof DataGrid>['onSortChange']
  selectedKeys?: React.ComponentProps<typeof DataGrid>['selectedKeys']
  sortDescriptor?: React.ComponentProps<typeof DataGrid>['sortDescriptor']
}

// Unlike Table's automatic checkbox column, DataGrid's selection UI is consumer-placed - see
// DataGridSelectionCell's own doc comment - so this harness has no selection column at all.
// `SelectableDataGrid` below is the separate harness that adds one.
const BasicDataGrid = ({
  disabledKeys,
  onSelectionChange,
  onSortChange,
  selectedKeys,
  sortDescriptor
}: BasicDataGridProps = {}) => (
  <DataGrid
    aria-label="Users"
    disabledKeys={disabledKeys}
    onSelectionChange={onSelectionChange}
    onSortChange={onSortChange}
    rowHeight={40}
    selectedKeys={selectedKeys}
    selectionMode={onSelectionChange || selectedKeys ? 'single' : 'none'}
    sortDescriptor={sortDescriptor}
  >
    <DataGridHeader>
      <DataGridColumn allowsSorting id="name" isRowHeader>
        Name
      </DataGridColumn>
      <DataGridColumn id="username">Username</DataGridColumn>
    </DataGridHeader>
    <DataGridBody items={rows}>
      {(row) => (
        <DataGridRow id={row.id}>
          <DataGridCell>{row.name}</DataGridCell>
          <DataGridCell>{row.username}</DataGridCell>
        </DataGridRow>
      )}
    </DataGridBody>
  </DataGrid>
)

interface SelectableDataGridProps {
  disabledKeys?: React.ComponentProps<typeof DataGrid>['disabledKeys']
  onSelectionChange?: React.ComponentProps<typeof DataGrid>['onSelectionChange']
  selectedKeys?: React.ComponentProps<typeof DataGrid>['selectedKeys']
}

const SelectableDataGrid = ({
  disabledKeys,
  onSelectionChange,
  selectedKeys
}: SelectableDataGridProps = {}) => (
  <DataGrid
    aria-label="Users"
    disabledKeys={disabledKeys}
    onSelectionChange={onSelectionChange}
    rowHeight={40}
    selectedKeys={selectedKeys}
    selectionMode="multiple"
  >
    <DataGridHeader>
      <DataGridColumn className="datagrid-selection-cell" defaultWidth={44} minWidth={44}>
        <DataGridSelectAllCell />
      </DataGridColumn>
      <DataGridColumn id="name" isRowHeader>
        Name
      </DataGridColumn>
      <DataGridColumn id="username">Username</DataGridColumn>
    </DataGridHeader>
    <DataGridBody items={rows}>
      {(row) => (
        <DataGridRow id={row.id}>
          <DataGridCell className="datagrid-selection-cell">
            <DataGridSelectionCell />
          </DataGridCell>
          <DataGridCell>{row.name}</DataGridCell>
          <DataGridCell>{row.username}</DataGridCell>
        </DataGridRow>
      )}
    </DataGridBody>
  </DataGrid>
)

describe('DataGrid', () => {
  describe('rendering', () => {
    test('renders an accessible grid with column headers, rows, and cells', () => {
      render(<BasicDataGrid />)
      expect(screen.getByRole('grid', { name: 'Users' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /Name/ })).toBeInTheDocument()
      expect(screen.getAllByRole('row')).toHaveLength(4) // 1 header row + 3 body rows
      expect(screen.getByRole('rowheader', { name: 'Mark' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '@mdo' })).toBeInTheDocument()
    })
  })

  describe('styling props', () => {
    test('renders align, bordered, hoverable, sm, and color variants', () => {
      render(
        <DataGrid
          align="middle"
          aria-label="Styled"
          bordered
          className="bazinga"
          color="info"
          hover
          rowHeight={40}
          sm
        >
          <DataGridHeader>
            <DataGridColumn id="name" isRowHeader>
              Name
            </DataGridColumn>
          </DataGridHeader>
          <DataGridBody items={rows}>
            {(row) => (
              <DataGridRow id={row.id}>
                <DataGridCell>{row.name}</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )
      expect(screen.getByRole('grid')).toHaveClass(
        'datagrid',
        'info',
        'align-middle',
        'bordered',
        'hoverable',
        'sm',
        'bazinga'
      )
    })

    test('applies className to DataGridHeader, DataGridBody, DataGridColumn, DataGridRow, and DataGridCell', () => {
      render(
        <DataGrid aria-label="Styled sub-components" rowHeight={40}>
          <DataGridHeader className="head-class">
            <DataGridColumn className="column-class" id="name" isRowHeader>
              Name
            </DataGridColumn>
          </DataGridHeader>
          <DataGridBody className="body-class" items={rows}>
            {(row) => (
              <DataGridRow className="row-class" id={row.id}>
                <DataGridCell className="cell-class">{row.name}</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )
      // `[role="rowgroup"]` has no accessible-name query - structural containers only.
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByRole('grid').querySelector('.datagrid-header')).toHaveClass('head-class')
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByRole('grid').querySelector('.datagrid-body')).toHaveClass('body-class')
      expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveClass('column-class')
      expect(screen.getByRole('row', { name: /Mark/ })).toHaveClass('row-class')
      expect(screen.getByRole('rowheader', { name: 'Mark' })).toHaveClass('cell-class')
    })
  })

  describe('sorting', () => {
    test('clicking a sortable column header fires onSortChange', () => {
      const onSortChange = vi.fn()
      render(<BasicDataGrid onSortChange={onSortChange} />)
      fireEvent.click(screen.getByRole('columnheader', { name: /Name/ }))
      expect(onSortChange).toHaveBeenCalledWith({ column: 'name', direction: 'ascending' })
    })

    test('the active sort column reflects aria-sort and shows the active-direction icon', () => {
      render(<BasicDataGrid sortDescriptor={{ column: 'name', direction: 'descending' }} />)
      const column = screen.getByRole('columnheader', { name: /Name/ })
      expect(column).toHaveAttribute('aria-sort', 'descending')
      expect(column).toHaveTextContent('▼')
    })

    test('a non-sorted sortable column shows the neutral icon', () => {
      render(<BasicDataGrid sortDescriptor={{ column: 'username', direction: 'ascending' }} />)
      expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveTextContent('⇅')
    })
  })

  describe('column sizing', () => {
    test('defaultWidth/minWidth size a column independent of the other, unsized columns', () => {
      render(<SelectableDataGrid />)
      const selectAll = screen.getByRole('checkbox', { name: /select all/i })
      // The virtualizer positions each column via an inline `width` on its wrapping element, two
      // levels up from the checkbox - not a stylesheet rule reachable through `className`. See
      // DataGridColumn's own doc comment for why a plain CSS `width` rule can't do this.
      // eslint-disable-next-line testing-library/no-node-access
      expect(selectAll.closest('[role="columnheader"]')?.parentElement).toHaveStyle({
        width: '44px'
      })
    })
  })

  describe('row height', () => {
    // Stands in for the browser's real layout: maps each row's rendered text to a controlled
    // height so `scrollHeight` (which jsdom always reports as 0) reflects a distinct, known value
    // per row instead of collapsing every estimated row to the same wrong height.
    const withMockedScrollHeight = (heightByText: Record<string, number>, fallback = 0) => {
      const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight')
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
        configurable: true,
        get(this: HTMLElement) {
          const text = this.textContent ?? ''
          const match = Object.entries(heightByText).find(([key]) => text.includes(key))
          return match ? match[1] : fallback
        }
      })
      return () => {
        if (original) Object.defineProperty(HTMLElement.prototype, 'scrollHeight', original)
      }
    }

    beforeEach(() => {
      MockResizeObserver.instances = []
      globalThis.ResizeObserver = MockResizeObserver as unknown as typeof globalThis.ResizeObserver
    })

    test('fixed rowHeight renders every row at that height regardless of content size', () => {
      const restoreScrollHeight = withMockedScrollHeight({}, 999)
      render(<BasicDataGrid />)
      const markRow = screen.getByRole('row', { name: /Mark/ })
      const jacobRow = screen.getByRole('row', { name: /Jacob/ })
      // eslint-disable-next-line testing-library/no-node-access
      expect(markRow.parentElement).toHaveStyle({ height: '40px' })
      // A fixed-height row is never measured, so a later "resize" is a no-op.
      act(() => {
        MockResizeObserver.instances.forEach((instance) => instance.trigger())
      })
      // eslint-disable-next-line testing-library/no-node-access
      expect(jacobRow.parentElement).toHaveStyle({ height: '40px', top: '40px' })
      restoreScrollHeight()
    })

    test('rowHeight="auto" sizes each row to its own measured content height', () => {
      const restoreScrollHeight = withMockedScrollHeight({ Mark: 30, Jacob: 90 })
      render(
        <DataGrid aria-label="Users" estimatedRowHeight={20} rowHeight="auto">
          <DataGridHeader>
            <DataGridColumn id="name" isRowHeader>
              Name
            </DataGridColumn>
          </DataGridHeader>
          <DataGridBody items={rows.slice(0, 2)}>
            {(row) => (
              <DataGridRow id={row.id}>
                <DataGridCell>{row.name}</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )

      const markRow = screen.getByRole('row', { name: /Mark/ })
      const jacobRow = screen.getByRole('row', { name: /Jacob/ })
      // eslint-disable-next-line testing-library/no-node-access
      expect(markRow.parentElement).toHaveStyle({ height: '30px', top: '0px' })
      // Jacob's offset reflects Mark's real 30px height, not the 20px estimate that seeded layout
      // before Mark was measured.
      // eslint-disable-next-line testing-library/no-node-access
      expect(jacobRow.parentElement).toHaveStyle({ height: '90px', top: '30px' })
      restoreScrollHeight()
    })

    test('rowHeight="auto" still fixes the header row at estimatedRowHeight, unmeasured', () => {
      // A column-header cell measuring far taller than estimatedRowHeight must not grow the
      // header — see DataGridTableLayout's `headingHeight` wiring in DataGrid.tsx for why: without
      // it, the header's own sticky outer wrapper never re-syncs to a corrected header-cell
      // height, clipping the header content instead of growing to fit it.
      const restoreScrollHeight = withMockedScrollHeight({ Name: 77, Mark: 30 })
      render(
        <DataGrid aria-label="Users" estimatedRowHeight={20} rowHeight="auto">
          <DataGridHeader>
            <DataGridColumn id="name" isRowHeader>
              Name
            </DataGridColumn>
          </DataGridHeader>
          <DataGridBody items={rows.slice(0, 1)}>
            {(row) => (
              <DataGridRow id={row.id}>
                <DataGridCell>{row.name}</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )

      const columnHeader = screen.getByRole('columnheader', { name: 'Name' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(columnHeader.parentElement).toHaveStyle({ height: '20px' })
      restoreScrollHeight()
    })

    test('a later content-size change re-measures the row and repositions subsequent rows', () => {
      let markHeight = 30
      const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight')
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
        configurable: true,
        get(this: HTMLElement) {
          const text = this.textContent ?? ''
          if (text.includes('Mark')) return markHeight
          if (text.includes('Jacob')) return 30
          return 0
        }
      })

      render(
        <DataGrid aria-label="Users" estimatedRowHeight={20} rowHeight="auto">
          <DataGridHeader>
            <DataGridColumn id="name" isRowHeader>
              Name
            </DataGridColumn>
          </DataGridHeader>
          <DataGridBody items={rows.slice(0, 2)}>
            {(row) => (
              <DataGridRow id={row.id}>
                <DataGridCell>{row.name}</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )

      // Simulate Mark's cell content growing after mount (e.g. async content, a reflow).
      markHeight = 100
      act(() => {
        MockResizeObserver.instances.forEach((instance) => instance.trigger())
      })

      const markRow = screen.getByRole('row', { name: /Mark/ })
      const jacobRow = screen.getByRole('row', { name: /Jacob/ })
      // eslint-disable-next-line testing-library/no-node-access
      expect(markRow.parentElement).toHaveStyle({ height: '100px' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(jacobRow.parentElement).toHaveStyle({ top: '100px' })

      if (original) Object.defineProperty(HTMLElement.prototype, 'scrollHeight', original)
    })
  })

  describe('selection', () => {
    test('multiple selection mode: a row checkbox reports selection changes', () => {
      const onSelectionChange = vi.fn()
      render(<SelectableDataGrid onSelectionChange={onSelectionChange} />)
      const row = screen.getByRole('row', { name: /Mark/ })
      const checkbox = within(row).getByRole('checkbox')
      fireEvent.click(checkbox)
      expect(onSelectionChange).toHaveBeenCalled()
      const selected = onSelectionChange.mock.calls[0]![0] as Set<React.Key>
      expect(selected.has('1')).toBe(true)
    })

    test('select-all checkbox selects every row', () => {
      const onSelectionChange = vi.fn()
      render(<SelectableDataGrid onSelectionChange={onSelectionChange} />)
      const selectAll = screen.getByRole('checkbox', { name: /select all/i })
      fireEvent.click(selectAll)
      const selected = onSelectionChange.mock.calls[0]![0]
      expect(selected).toBe('all')
    })

    test('a selected row is marked with data-selected', () => {
      render(<SelectableDataGrid selectedKeys={new Set(['1'])} />)
      expect(screen.getByRole('row', { name: /Mark/ })).toHaveAttribute('data-selected', 'true')
      expect(screen.getByRole('row', { name: /Jacob/ })).not.toHaveAttribute('data-selected')
    })

    test('a row checkbox is named by the row it belongs to', () => {
      // The name comes from the props react-aria-components publishes on `CheckboxContext` — a
      // localized label plus an `aria-labelledby` pointing at the row's row-header cells. Asserting
      // it here is what catches a regression back to computing those props ourselves, which throws
      // outright as soon as a second copy of `react-aria` is installed.
      render(<SelectableDataGrid />)
      const row = screen.getByRole('row', { name: /Mark/ })
      expect(within(row).getByRole('checkbox')).toHaveAccessibleName(/Mark/)
    })

    test('single selection mode selects a row on click, with no checkboxes', () => {
      const onSelectionChange = vi.fn()
      render(<BasicDataGrid onSelectionChange={onSelectionChange} />)
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
      fireEvent.click(screen.getByRole('rowheader', { name: 'Mark' }))
      const selected = onSelectionChange.mock.calls[0]![0] as Set<React.Key>
      expect(selected.has('1')).toBe(true)
    })

    test('disabled rows cannot be selected', () => {
      const onSelectionChange = vi.fn()
      render(<BasicDataGrid disabledKeys={['1']} onSelectionChange={onSelectionChange} />)
      fireEvent.click(screen.getByRole('rowheader', { name: 'Mark' }))
      expect(onSelectionChange).not.toHaveBeenCalled()
    })
  })

  describe('keyboard navigation', () => {
    test('arrow keys move focus between cells for keyboard grid navigation', () => {
      render(<BasicDataGrid />)
      const firstColumn = screen.getByRole('columnheader', { name: /Name/ })
      act(() => {
        firstColumn.focus()
      })
      expect(firstColumn).toHaveFocus()

      fireEvent.keyDown(firstColumn, { key: 'ArrowRight' })
      expect(screen.getByRole('columnheader', { name: 'Username' })).toHaveFocus()

      // document.activeElement is the standard way to read current focus; no Testing Library
      // query surfaces it.
      // eslint-disable-next-line testing-library/no-node-access
      fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowDown' })
      expect(screen.getByRole('gridcell', { name: '@mdo' })).toHaveFocus()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying grid root', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <DataGrid aria-label="Ref test" ref={ref} rowHeight={40}>
          <DataGridHeader>
            <DataGridColumn id="name" isRowHeader>
              Name
            </DataGridColumn>
          </DataGridHeader>
          <DataGridBody items={rows}>
            {(row) => (
              <DataGridRow id={row.id}>
                <DataGridCell>{row.name}</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )
      expect(ref.current).toBeInstanceOf(HTMLElement)
      expect(ref.current).toHaveAttribute('role', 'grid')
    })
  })

  describe('empty state', () => {
    test('renderEmptyState shows in place of rows when items is empty', () => {
      render(
        <DataGrid aria-label="Users" rowHeight={40}>
          <DataGridHeader>
            <DataGridColumn id="name" isRowHeader>
              Name
            </DataGridColumn>
          </DataGridHeader>
          <DataGridBody items={[]} renderEmptyState={() => 'No users found'}>
            {(row: (typeof rows)[number]) => (
              <DataGridRow id={row.id}>
                <DataGridCell>{row.name}</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )
      expect(screen.getByText('No users found')).toBeInTheDocument()
    })
  })

  describe('pinned columns', () => {
    const PinnedDataGrid = () => (
      <DataGrid aria-label="Pinned" rowHeight={40}>
        <DataGridHeader>
          <DataGridColumn defaultWidth={80} id="a" pin="start">
            A
          </DataGridColumn>
          <DataGridColumn defaultWidth={80} id="b" pin="start">
            B
          </DataGridColumn>
          <DataGridColumn defaultWidth={80} id="c">
            C
          </DataGridColumn>
          <DataGridColumn defaultWidth={80} id="d" pin="end">
            D
          </DataGridColumn>
        </DataGridHeader>
        <DataGridBody items={rows}>
          {(row) => (
            <DataGridRow id={row.id}>
              <DataGridCell>{row.name}</DataGridCell>
              <DataGridCell>{row.name}</DataGridCell>
              <DataGridCell>{row.name}</DataGridCell>
              <DataGridCell>{row.name}</DataGridCell>
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    )

    test('adds a pinned className to a pin="start"/pin="end" column header, not to an unpinned one', () => {
      render(<PinnedDataGrid />)
      expect(screen.getByRole('columnheader', { name: 'A' })).toHaveClass(
        'datagrid-col-pinned-start'
      )
      expect(screen.getByRole('columnheader', { name: 'D' })).toHaveClass('datagrid-col-pinned-end')
      expect(screen.getByRole('columnheader', { name: 'C' }).className).not.toMatch(
        /datagrid-col-pinned/
      )
    })

    test('positions pin="start" columns with sticky CSS via DataGridTableLayout, stacked in declaration order', () => {
      render(<PinnedDataGrid />)
      const a = screen.getByRole('columnheader', { name: 'A' })
      const b = screen.getByRole('columnheader', { name: 'B' })
      const c = screen.getByRole('columnheader', { name: 'C' })
      // The sticky positioning is applied to each header cell's own virtualizer wrapper div, not
      // the header cell itself - no accessible-name query reaches it, so this steps to the parent.
      // eslint-disable-next-line testing-library/no-node-access
      expect(a.parentElement).toHaveStyle({ position: 'sticky', left: '0px' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(b.parentElement).toHaveStyle({ position: 'sticky', left: '80px' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(c.parentElement).not.toHaveStyle({ position: 'sticky' })
    })

    test('generates scroll-cue rules for the boundary pinned column, scoped to this grid instance', () => {
      render(<PinnedDataGrid />)
      const grid = screen.getByRole('grid')
      const instanceClassName = Array.from(grid.classList).find((name) =>
        /^datagrid-\w+$/.test(name)
      )
      expect(instanceClassName).toBeDefined()
      // DataGridPinBehavior's <style> renders as a sibling of the grid, not inside it.
      // eslint-disable-next-line testing-library/no-node-access
      const css = grid.parentElement?.querySelector('style')?.textContent ?? ''
      // Column B is the last pin="start" (aria-colindex 2), D the first pin="end" (colindex 4).
      expect(css).toContain(`.${instanceClassName}.datagrid-scrolled-start [aria-colindex="2"]`)
      expect(css).toContain(`.${instanceClassName}.datagrid-scrolled-end [aria-colindex="4"]`)
    })

    test('marks every rendered cell with the aria-colindex the pin rules target', () => {
      render(<PinnedDataGrid />)
      expect(screen.getByRole('columnheader', { name: 'A' })).toHaveAttribute('aria-colindex', '1')
      expect(screen.getByRole('columnheader', { name: 'D' })).toHaveAttribute('aria-colindex', '4')
    })
  })

  describe('header/footer pinning', () => {
    test('the header row is sticky-positioned to stay visible while body rows scroll', () => {
      render(<BasicDataGrid />)
      const grid = screen.getByRole('grid')
      // The virtualizer's own wrapper div around the header rowgroup, not the rowgroup itself -
      // no accessible-name query reaches it, same pattern the pinned-columns tests above use.
      // eslint-disable-next-line testing-library/no-node-access
      const headerWrapper = grid.querySelector('.datagrid-header')?.parentElement
      expect(headerWrapper).toHaveStyle({ position: 'sticky' })
    })

    test('footer renders outside the grid, not part of the keyboard-navigable rowgroups', () => {
      render(
        <DataGrid aria-label="Users" footer="3 users" rowHeight={40}>
          <DataGridHeader>
            <DataGridColumn id="name" isRowHeader>
              Name
            </DataGridColumn>
          </DataGridHeader>
          <DataGridBody items={rows}>
            {(row) => (
              <DataGridRow id={row.id}>
                <DataGridCell>{row.name}</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )
      const grid = screen.getByRole('grid')
      const footer = screen.getByText('3 users')
      expect(footer).toHaveClass('datagrid-footer')
      // A sibling of the grid, not a descendant of it - confirms it sits outside the
      // scrollable/virtualized region and the grid's own row/cell role hierarchy.
      expect(grid.contains(footer)).toBe(false)
      expect(footer).not.toHaveAttribute('role')
    })

    test('footer respects borderless', () => {
      render(
        <DataGrid aria-label="Users" borderless footer="3 users" rowHeight={40}>
          <DataGridHeader>
            <DataGridColumn id="name" isRowHeader>
              Name
            </DataGridColumn>
          </DataGridHeader>
          <DataGridBody items={rows}>
            {(row) => (
              <DataGridRow id={row.id}>
                <DataGridCell>{row.name}</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )
      expect(screen.getByText('3 users')).toHaveClass('datagrid-footer', 'borderless')
    })

    test('no footer element renders when the footer prop is omitted', () => {
      render(<BasicDataGrid />)
      const grid = screen.getByRole('grid')
      // eslint-disable-next-line testing-library/no-node-access
      expect(grid.parentElement?.querySelector('.datagrid-footer')).not.toBeInTheDocument()
    })
  })

  describe('misuse', () => {
    test('DataGridSelectionCell throws a clear error rendered outside a DataGrid', () => {
      // Suppress the expected React error boundary console output for this one assertion.
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => render(<DataGridSelectionCell />)).toThrow(
        'DataGridSelectionCell must be rendered inside a DataGrid with selection enabled.'
      )
      consoleError.mockRestore()
    })

    test('DataGridSelectAllCell throws a clear error rendered outside a DataGrid', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => render(<DataGridSelectAllCell />)).toThrow(
        'DataGridSelectAllCell must be rendered inside a DataGrid with selection enabled.'
      )
      consoleError.mockRestore()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<BasicDataGrid />)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations with multiple selection (row checkboxes + select-all)', async () => {
      const { container } = render(<SelectableDataGrid selectedKeys={new Set(['1'])} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

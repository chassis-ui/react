import * as React from 'react'
import { act, render, screen, fireEvent, within } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '../../../src/index'

const rows = [
  { id: '1', name: 'Mark', username: '@mdo' },
  { id: '2', name: 'Jacob', username: '@fat' },
  { id: '3', name: 'Larry', username: '@twitter' }
]

interface BasicTableProps {
  disabledKeys?: React.ComponentProps<typeof Table>['disabledKeys']
  onSelectionChange?: React.ComponentProps<typeof Table>['onSelectionChange']
  onSortChange?: React.ComponentProps<typeof Table>['onSortChange']
  selectedKeys?: React.ComponentProps<typeof Table>['selectedKeys']
  selectionMode?: React.ComponentProps<typeof Table>['selectionMode']
  sortDescriptor?: React.ComponentProps<typeof Table>['sortDescriptor']
}

// react-stately's first column becomes the row header (`role="rowheader"`, not `"gridcell"`) by
// default — standard ARIA grid semantics, not something Table opts into. "Name" is that first
// column below, so its cells are queried as rowheaders throughout.
const BasicTable = ({
  disabledKeys,
  onSelectionChange,
  onSortChange,
  selectedKeys,
  selectionMode,
  sortDescriptor
}: BasicTableProps = {}) => (
  <Table
    aria-label="Users"
    disabledKeys={disabledKeys}
    onSelectionChange={onSelectionChange}
    onSortChange={onSortChange}
    selectedKeys={selectedKeys}
    selectionMode={selectionMode}
    sortDescriptor={sortDescriptor}
  >
    <TableHeader>
      <TableColumn key="name" allowsSorting>
        Name
      </TableColumn>
      <TableColumn key="username">Username</TableColumn>
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

describe('Table', () => {
  describe('rendering', () => {
    test('renders an accessible grid with column headers, rows, and cells', () => {
      render(<BasicTable />)
      expect(screen.getByRole('grid', { name: 'Users' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
      expect(screen.getAllByRole('row')).toHaveLength(4) // 1 header row + 3 body rows
      expect(screen.getByRole('rowheader', { name: 'Mark' })).toBeInTheDocument()
      expect(screen.getByRole('gridcell', { name: '@mdo' })).toBeInTheDocument()
    })

    test('renders a caption and a plain footer', () => {
      render(
        <Table
          aria-label="With caption"
          caption="List of users"
          footer={
            <tr>
              <td>Total: 3</td>
            </tr>
          }
        >
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {(row) => <TableRow key={row.id}>{() => <TableCell>{row.name}</TableCell>}</TableRow>}
          </TableBody>
        </Table>
      )
      expect(screen.getByText('List of users')).toBeInTheDocument()
      expect(screen.getByText('Total: 3')).toBeInTheDocument()
    })
  })

  describe('styling props', () => {
    test('renders bordered, striped, hoverable, and color variants', () => {
      const { container } = render(
        <Table
          aria-label="Styled"
          bordered
          className="bazinga"
          color="info"
          hover
          responsive="xl"
          sm
          striped
        >
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {(row) => <TableRow key={row.id}>{() => <TableCell>{row.name}</TableCell>}</TableRow>}
          </TableBody>
        </Table>
      )
      // The responsive wrapper is a plain div with no role/name - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('max-xl:table-responsive')
      const table = screen.getByRole('grid')
      expect(table).toHaveClass(
        'table',
        'info',
        'context',
        'bordered',
        'hoverable',
        'sm',
        'striped',
        'bazinga'
      )
    })

    test('applies className to TableHeader, TableBody, TableColumn, TableRow, and TableCell', () => {
      render(
        <Table aria-label="Styled sub-components">
          <TableHeader className="head-class">
            <TableColumn key="name" className="column-class">
              Name
            </TableColumn>
          </TableHeader>
          <TableBody className="body-class" items={rows}>
            {(row) => (
              <TableRow className="row-class" key={row.id}>
                {() => <TableCell className="cell-class">{row.name}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )
      // `<thead>`/`<tbody>` have no accessible role query - structural containers only.
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByRole('grid').querySelector('thead')).toHaveClass('head-class')
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByRole('grid').querySelector('tbody')).toHaveClass('body-class')
      expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveClass('column-class')
      expect(screen.getByRole('row', { name: /Mark/ })).toHaveClass('row-class')
      expect(screen.getByRole('rowheader', { name: 'Mark' })).toHaveClass('cell-class')
    })
  })

  describe('stacked', () => {
    test('true adds the stacked class and wraps in a responsive container with no breakpoint', () => {
      const { container } = render(
        <Table aria-label="Stacked" stacked>
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {(row) => <TableRow key={row.id}>{() => <TableCell>{row.name}</TableCell>}</TableRow>}
          </TableBody>
        </Table>
      )
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('table-responsive')
      expect(screen.getByRole('grid')).toHaveClass('stacked')
    })

    test('a breakpoint name adds the max-{breakpoint}:stacked class', () => {
      render(
        <Table aria-label="Stacked" stacked="md">
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {(row) => <TableRow key={row.id}>{() => <TableCell>{row.name}</TableCell>}</TableRow>}
          </TableBody>
        </Table>
      )
      expect(screen.getByRole('grid')).toHaveClass('max-md:stacked')
    })

    test('does not wrap in a responsive container or add data-cell when unset', () => {
      const { container } = render(<BasicTable />)
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).not.toHaveClass('table-responsive')
      expect(screen.getByRole('rowheader', { name: 'Mark' })).not.toHaveAttribute('data-cell')
    })

    test('labels each cell with data-cell from its column header text', () => {
      render(
        <Table aria-label="Stacked" stacked>
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
            <TableColumn key="username">Username</TableColumn>
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
      expect(screen.getByRole('rowheader', { name: 'Mark' })).toHaveAttribute('data-cell', 'Name')
      expect(screen.getByRole('gridcell', { name: '@mdo' })).toHaveAttribute(
        'data-cell',
        'Username'
      )
    })

    test('a non-string column header falls back to textValue for data-cell', () => {
      render(
        <Table aria-label="Stacked" stacked>
          <TableHeader>
            <TableColumn key="name" textValue="Name">
              <strong>Name</strong>
            </TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {(row) => <TableRow key={row.id}>{() => <TableCell>{row.name}</TableCell>}</TableRow>}
          </TableBody>
        </Table>
      )
      expect(screen.getByRole('rowheader', { name: 'Mark' })).toHaveAttribute('data-cell', 'Name')
    })
  })

  describe('sorting', () => {
    test('clicking a sortable column header fires onSortChange', () => {
      const onSortChange = vi.fn()
      render(<BasicTable onSortChange={onSortChange} />)
      fireEvent.click(screen.getByRole('columnheader', { name: 'Name' }))
      expect(onSortChange).toHaveBeenCalledWith({ column: 'name', direction: 'ascending' })
    })

    test('the active sort column reflects aria-sort', () => {
      render(<BasicTable sortDescriptor={{ column: 'name', direction: 'descending' }} />)
      expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
        'aria-sort',
        'descending'
      )
    })
  })

  describe('selection', () => {
    test('multiple selection mode renders checkboxes and reports selection changes', () => {
      const onSelectionChange = vi.fn()
      render(<BasicTable onSelectionChange={onSelectionChange} selectionMode="multiple" />)
      const row = screen.getByRole('row', { name: /Mark/ })
      const checkbox = within(row).getByRole('checkbox')
      fireEvent.click(checkbox)
      expect(onSelectionChange).toHaveBeenCalled()
      const selected = onSelectionChange.mock.calls[0]![0] as Set<React.Key>
      expect(selected.has('1')).toBe(true)
    })

    test('select-all checkbox selects every row', () => {
      const onSelectionChange = vi.fn()
      render(<BasicTable onSelectionChange={onSelectionChange} selectionMode="multiple" />)
      const selectAll = screen.getByRole('checkbox', { name: /select all/i })
      fireEvent.click(selectAll)
      const selected = onSelectionChange.mock.calls[0]![0]
      expect(selected).toBe('all')
    })

    test('a selected row is highlighted with the active class', () => {
      render(<BasicTable selectedKeys={new Set(['1'])} selectionMode="multiple" />)
      expect(screen.getByRole('row', { name: /Mark/ })).toHaveClass('active')
      expect(screen.getByRole('row', { name: /Jacob/ })).not.toHaveClass('active')
    })

    test('a change to single selection keeps the first selected row and reports it once', () => {
      const onSelectionChange = vi.fn()
      const { rerender } = render(
        <BasicTable
          onSelectionChange={onSelectionChange}
          selectedKeys={new Set(['1', '2'])}
          selectionMode="multiple"
        />
      )
      rerender(
        <BasicTable
          onSelectionChange={onSelectionChange}
          selectedKeys={new Set(['1', '2'])}
          selectionMode="single"
        />
      )
      expect(screen.getByRole('row', { name: /Mark/ })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('row', { name: /Jacob/ })).not.toHaveAttribute(
        'aria-selected',
        'true'
      )
      expect(onSelectionChange).toHaveBeenCalledExactlyOnceWith(new Set(['1']))
    })

    test('an uncontrolled selection is trimmed too when the mode changes to single', () => {
      const onSelectionChange = vi.fn()
      const { rerender } = render(
        <BasicTable onSelectionChange={onSelectionChange} selectionMode="multiple" />
      )
      fireEvent.click(within(screen.getByRole('row', { name: /Mark/ })).getByRole('checkbox'))
      fireEvent.click(within(screen.getByRole('row', { name: /Jacob/ })).getByRole('checkbox'))
      rerender(<BasicTable onSelectionChange={onSelectionChange} selectionMode="single" />)
      expect(screen.getByRole('row', { name: /Mark/ })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('row', { name: /Jacob/ })).not.toHaveAttribute(
        'aria-selected',
        'true'
      )
      expect(new Set(onSelectionChange.mock.lastCall?.[0] as Iterable<React.Key>)).toEqual(
        new Set(['1'])
      )
    })

    test('single selection mode selects a row on click, with no checkboxes', () => {
      const onSelectionChange = vi.fn()
      render(<BasicTable onSelectionChange={onSelectionChange} selectionMode="single" />)
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
      fireEvent.click(screen.getByRole('rowheader', { name: 'Mark' }))
      const selected = onSelectionChange.mock.calls[0]![0] as Set<React.Key>
      expect(selected.has('1')).toBe(true)
    })

    test('disabled rows cannot be selected', () => {
      const onSelectionChange = vi.fn()
      render(
        <BasicTable
          disabledKeys={['1']}
          onSelectionChange={onSelectionChange}
          selectionMode="single"
        />
      )
      fireEvent.click(screen.getByRole('rowheader', { name: 'Mark' }))
      expect(onSelectionChange).not.toHaveBeenCalled()
    })
    // react-stately's default `disabledBehavior`, `'selection'`, left a disabled row focusable and
    // unmarked, where `DataGrid`'s are neither.
    test('a disabled row is marked and skipped by the keyboard', () => {
      render(<BasicTable disabledKeys={['2']} selectionMode="multiple" />)
      const bodyRows = screen.getAllByRole('row').slice(1)
      expect(bodyRows[1]).toHaveAttribute('aria-disabled', 'true')
      expect(bodyRows[0]).not.toHaveAttribute('aria-disabled')

      const mark = screen.getByRole('rowheader', { name: 'Mark' })
      act(() => mark.focus())
      fireEvent.keyDown(mark, { key: 'ArrowDown' })
      expect(screen.getByRole('rowheader', { name: 'Larry' })).toHaveFocus()
    })
  })

  // A React `key` is always a string: `key={row.id}` made a numeric id `"1"`, which numeric
  // `selectedKeys`/`disabledKeys` never matched.
  describe('numeric row ids', () => {
    const NumTable = (props: Omit<BasicTableProps, 'onSortChange' | 'sortDescriptor'>) => (
      <Table aria-label="Nums" selectionMode="multiple" {...props}>
        <TableHeader>
          <TableColumn key="name">Name</TableColumn>
        </TableHeader>
        <TableBody
          items={[
            { id: 1, name: 'Mark' },
            { id: 2, name: 'Jacob' }
          ]}
        >
          {(row) => <TableRow id={row.id}>{() => <TableCell>{row.name}</TableCell>}</TableRow>}
        </TableBody>
      </Table>
    )
    const bodyRows = () => screen.getAllByRole('row').slice(1)

    test('keeps a numeric id for selectedKeys, disabledKeys and onSelectionChange', () => {
      const onSelectionChange = vi.fn()
      const { unmount } = render(<NumTable selectedKeys={new Set([1])} />)
      expect(bodyRows()[0]).toHaveAttribute('aria-selected', 'true')
      unmount()

      render(<NumTable disabledKeys={[2]} onSelectionChange={onSelectionChange} />)
      fireEvent.click(within(bodyRows()[1]!).getByRole('checkbox'))
      expect(onSelectionChange).not.toHaveBeenCalled()
      fireEvent.click(within(bodyRows()[0]!).getByRole('checkbox'))
      expect([...(onSelectionChange.mock.calls[0]![0] as Set<React.Key>)]).toEqual([1])
    })

    test('id wins over a key given beside it', () => {
      const onSelectionChange = vi.fn()
      render(
        <Table aria-label="Nums" onSelectionChange={onSelectionChange} selectionMode="single">
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow id={7} key="seven">
              <TableCell>Seven</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      fireEvent.click(screen.getByRole('rowheader', { name: 'Seven' }))
      expect([...(onSelectionChange.mock.calls[0]![0] as Set<React.Key>)]).toEqual([7])
    })
  })

  describe('keyboard navigation', () => {
    test('arrow keys move focus between cells for keyboard grid navigation', () => {
      render(<BasicTable />)
      const firstCell = screen.getByRole('columnheader', { name: /Name/ })
      act(() => {
        firstCell.focus()
      })
      expect(firstCell).toHaveFocus()

      fireEvent.keyDown(firstCell, { key: 'ArrowRight' })
      expect(screen.getByRole('columnheader', { name: 'Username' })).toHaveFocus()

      // document.activeElement is the standard way to read current focus; no Testing Library
      // query surfaces it.
      // eslint-disable-next-line testing-library/no-node-access
      fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowDown' })
      expect(screen.getByRole('gridcell', { name: '@mdo' })).toHaveFocus()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying table', () => {
      const ref = React.createRef<HTMLTableElement>()
      render(
        <Table aria-label="Ref test" ref={ref}>
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {(row) => <TableRow key={row.id}>{() => <TableCell>{row.name}</TableCell>}</TableRow>}
          </TableBody>
        </Table>
      )
      expect(ref.current).toBeInstanceOf(HTMLTableElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<BasicTable />)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations with multiple selection (row checkboxes + select-all)', async () => {
      const { container } = render(
        <BasicTable selectedKeys={new Set(['1'])} selectionMode="multiple" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    test('marks every column header with scope="col"', () => {
      render(<BasicTable selectionMode="multiple" />)

      // react-aria supplies `role="columnheader"` for the ARIA grid pattern but no `scope`, which
      // leaves the *native* table semantics ambiguous and fails WCAG H63. Covers the select-all
      // header cell too, which is a separate `<th>` render path.
      const headers = screen.getAllByRole('columnheader')
      expect(headers.length).toBeGreaterThan(1)
      headers.forEach((header) => {
        expect(header).toHaveAttribute('scope', 'col')
      })
    })
  })
})

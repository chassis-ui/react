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
          responsive="xlarge"
          small
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
      expect(container.firstChild).toHaveClass('max-xlarge:table-responsive')
      const table = screen.getByRole('grid')
      expect(table).toHaveClass(
        'table',
        'info',
        'bordered',
        'hoverable',
        'small',
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
        <Table aria-label="Stacked" stacked="medium">
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {(row) => <TableRow key={row.id}>{() => <TableCell>{row.name}</TableCell>}</TableRow>}
          </TableBody>
        </Table>
      )
      expect(screen.getByRole('grid')).toHaveClass('max-medium:stacked')
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
  })
})

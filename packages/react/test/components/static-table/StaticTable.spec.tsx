import * as React from 'react'
import { render, screen, within } from '@testing-library/react'
// Aliased: testing-library's lint rules treat any `render*` call's result as a `render()` result.
import { renderToStaticMarkup as toHtml } from 'react-dom/server'
import { axe } from 'jest-axe'

import {
  StaticTable,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '../../../src/index'
import { StaticTable as StaticTableFromEntry } from '../../../src/components/static-table'

const Rows = () => (
  <>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Username</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td data-cell="Name">Mark</td>
        <td data-cell="Username">
          <a href="/u/mdo">@mdo</a>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colSpan={2}>1 user</td>
      </tr>
    </tfoot>
  </>
)

describe('StaticTable', () => {
  test('renders its children as plain, native table markup', () => {
    render(
      <StaticTable aria-label="Users">
        <Rows />
      </StaticTable>
    )

    const table = screen.getByRole('table', { name: 'Users' })
    expect(table).toHaveClass('table')
    // No ARIA grid semantics: it's a native table, not react-aria's `role="grid"`.
    expect(table).not.toHaveAttribute('role')
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('scope', 'col')
    expect(screen.getByRole('cell', { name: 'Mark' })).toHaveAttribute('data-cell', 'Name')
    expect(screen.getByRole('link', { name: '@mdo' })).toHaveAttribute('href', '/u/mdo')
    expect(screen.getByRole('cell', { name: '1 user' })).toHaveAttribute('colspan', '2')
  })

  test('applies each styling prop as its chassis-css class', () => {
    render(
      <StaticTable
        align="middle"
        aria-label="Users"
        bordered
        className="custom"
        color="primary"
        hover
        sm
        striped
      >
        <Rows />
      </StaticTable>
    )

    expect(screen.getByRole('table')).toHaveClass(
      'table',
      'primary',
      'align-middle',
      'bordered',
      'hoverable',
      'sm',
      'striped',
      'custom'
    )
  })

  test('applies the same classes as Table for the same styling props', () => {
    const styling = {
      align: 'top',
      borderless: true,
      color: 'info',
      hover: true,
      stacked: 'md',
      striped: true
    } as const
    // The wrapper `<div>`'s class, then the `<table>`'s — everything else differs by design
    // (react-aria's grid role/ids on `Table`).
    const classes = (html: string) =>
      html.match(/^<div class="([^"]*)"><table[^>]*? class="([^"]*)"/)

    const staticClasses = classes(
      toHtml(
        <StaticTable aria-label="Users" {...styling}>
          <Rows />
        </StaticTable>
      )
    )
    const interactiveClasses = classes(
      toHtml(
        <Table aria-label="Users" {...styling}>
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>Mark</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
    )

    expect(staticClasses).not.toBeNull()
    expect(staticClasses?.slice(1)).toEqual(interactiveClasses?.slice(1))
  })

  test('renders a caption above the table content', () => {
    render(
      <StaticTable caption="List of users">
        <Rows />
      </StaticTable>
    )

    const table = screen.getByRole('table', { name: 'List of users' })
    expect(within(table).getByText('List of users').tagName).toBe('CAPTION')
  })

  test.each([
    [{ responsive: true }, 'table-responsive'],
    [{ responsive: 'lg' }, 'max-lg:table-responsive'],
    [{ stacked: true }, 'table-responsive'],
    [{ stacked: 'md', responsive: 'lg' }, 'max-lg:table-responsive']
  ] as const)('wraps the table in a responsive container for %o', (props, wrapperClass) => {
    const html = toHtml(
      <StaticTable aria-label="Users" {...props}>
        <Rows />
      </StaticTable>
    )

    expect(html.startsWith(`<div class="${wrapperClass}"><table `)).toBe(true)
  })

  test('renders no wrapper without responsive or stacked', () => {
    const html = toHtml(
      <StaticTable aria-label="Users">
        <Rows />
      </StaticTable>
    )

    expect(html.startsWith('<table ')).toBe(true)
  })

  test('forwards its ref and passes other attributes through to the <table>', () => {
    const ref = React.createRef<HTMLTableElement>()
    render(
      <StaticTable aria-label="Users" data-testid="users" id="users" ref={ref}>
        <Rows />
      </StaticTable>
    )

    expect(ref.current).toBe(screen.getByTestId('users'))
    expect(ref.current).toHaveAttribute('id', 'users')
  })

  test('renders to static markup with no hooks, as a Server Component would', () => {
    const html = toHtml(
      <StaticTableFromEntry aria-label="Users" striped>
        <Rows />
      </StaticTableFromEntry>
    )

    expect(html).toMatch(/^<table aria-label="Users" class="table striped">/)
  })

  test('has no accessibility violations', async () => {
    const { container } = render(
      <StaticTable caption="Users" hover responsive striped>
        <Rows />
      </StaticTable>
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})

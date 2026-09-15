import * as React from 'react'
import { useRef } from 'react'
import { act, render, screen } from '@testing-library/react'

import { DataGridColumn } from '../../../src/components/datagrid/DataGridColumn'
import { DataGridHeader } from '../../../src/components/datagrid/DataGridHeader'
import { DataGridPinBehavior } from '../../../src/components/datagrid/DataGridPinBehavior'

const setSize = (element: HTMLElement, sizes: { clientWidth?: number; scrollLeft?: number }) => {
  if (sizes.clientWidth != null) {
    Object.defineProperty(element, 'clientWidth', { value: sizes.clientWidth, configurable: true })
  }
  if (sizes.scrollLeft != null) {
    Object.defineProperty(element, 'scrollLeft', { value: sizes.scrollLeft, configurable: true })
  }
}

interface HarnessColumn {
  id: string
  defaultWidth: number
  pin?: 'start' | 'end'
}

interface HarnessProps {
  columns: HarnessColumn[]
  dynamicHeader?: boolean
  /**
   * The 0-based column positions to actually mount a cell for, mirroring the layout engine's
   * horizontal windowing. Defaults to all of them.
   */
  mountedColumns?: number[]
}

// Mirrors the DOM shape react-aria-components' virtualizer produces: one `[role="row"]` per row
// (header or body), each mounted column contributing a wrapper `<div>` (the element that gets
// positioned) around a cell carrying the 1-based `aria-colindex` of the column it belongs to.
// DataGridPinBehavior finds cells by that attribute, so the wrapper — not the cell — is what
// carries the test id here.
const Harness = ({ columns, dynamicHeader, mountedColumns }: HarnessProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const header = dynamicHeader ? (
    <DataGridHeader columns={[]}>{() => <DataGridColumn>x</DataGridColumn>}</DataGridHeader>
  ) : (
    <DataGridHeader>
      {columns.map((column) => (
        <DataGridColumn defaultWidth={column.defaultWidth} key={column.id} pin={column.pin}>
          {column.id}
        </DataGridColumn>
      ))}
    </DataGridHeader>
  )

  return (
    <div data-testid="pin-container" ref={containerRef}>
      <div role="row">
        {columns.map((column, index) =>
          mountedColumns && !mountedColumns.includes(index) ? null : (
            <div data-testid={`cell-${column.id}`} key={column.id}>
              <div aria-colindex={index + 1} role="gridcell" />
            </div>
          )
        )}
      </div>
      <DataGridPinBehavior containerRef={containerRef} header={header} instanceClassName="test" />
    </div>
  )
}

describe('DataGridPinBehavior', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('renders nothing when no column is pinned', () => {
    render(
      <Harness
        columns={[
          { id: 'a', defaultWidth: 100 },
          { id: 'b', defaultWidth: 100 }
        ]}
      />
    )
    // A <style> tag has no ARIA role and isn't reachable by an accessible query.
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.queryByTestId('pin-container')?.querySelector('style')).not.toBeInTheDocument()
  })

  test('renders nothing for the dynamic columns/render-function header form', () => {
    render(<Harness columns={[]} dynamicHeader />)
    // A <style> tag has no ARIA role and isn't reachable by an accessible query.
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.queryByTestId('pin-container')?.querySelector('style')).not.toBeInTheDocument()
  })

  test('positions a single pin="end" column flush against the trailing edge, accounting for scroll', () => {
    render(
      <Harness
        columns={[
          { id: 'a', defaultWidth: 100 },
          { id: 'b', defaultWidth: 100 },
          { id: 'c', defaultWidth: 80, pin: 'end' }
        ]}
      />
    )
    const container = screen.getByTestId('pin-container')
    setSize(container, { clientWidth: 400, scrollLeft: 50 })

    act(() => vi.runAllTimers())

    // offset(c) = 200, width(c) = 80 -> rightEdge = 280; rightOffset = 0 (only pinned column)
    // delta = clientWidth - rightOffset - rightEdge + scrollLeft = 400 - 0 - 280 + 50 = 170
    expect(screen.getByTestId('cell-c')).toHaveStyle({ transform: 'translateX(170px)' })
  })

  test('re-syncs the transform when the container scrolls further', () => {
    render(
      <Harness
        columns={[
          { id: 'a', defaultWidth: 100 },
          { id: 'b', defaultWidth: 80, pin: 'end' }
        ]}
      />
    )
    const container = screen.getByTestId('pin-container')
    setSize(container, { clientWidth: 300, scrollLeft: 0 })
    act(() => vi.runAllTimers())

    setSize(container, { scrollLeft: 40 })
    act(() => {
      container.dispatchEvent(new Event('scroll'))
      vi.runAllTimers()
    })

    // offset(b) = 100, width(b) = 80 -> rightEdge = 180
    // delta = 300 - 0 - 180 + 40 = 160
    expect(screen.getByTestId('cell-b')).toHaveStyle({ transform: 'translateX(160px)' })
  })

  test('stacks multiple pin="end" columns by cumulative width', () => {
    render(
      <Harness
        columns={[
          { id: 'a', defaultWidth: 100 },
          { id: 'b', defaultWidth: 60, pin: 'end' },
          { id: 'c', defaultWidth: 50, pin: 'end' }
        ]}
      />
    )
    const container = screen.getByTestId('pin-container')
    setSize(container, { clientWidth: 300, scrollLeft: 0 })
    act(() => vi.runAllTimers())

    // Column c (last, index 2): offset=160, width=50 -> rightEdge=210, rightOffset=0
    // delta = 300 - 0 - 210 + 0 = 90
    expect(screen.getByTestId('cell-c')).toHaveStyle({ transform: 'translateX(90px)' })

    // Column b (index 1): offset=100, width=60 -> rightEdge=160, rightOffset = width(c) = 50
    // delta = 300 - 50 - 160 + 0 = 90
    expect(screen.getByTestId('cell-b')).toHaveStyle({ transform: 'translateX(90px)' })
  })

  test('does not set a transform on a pin="start" column (positioned by DataGridTableLayout instead)', () => {
    render(
      <Harness
        columns={[
          { id: 'a', defaultWidth: 100, pin: 'start' },
          { id: 'b', defaultWidth: 100 }
        ]}
      />
    )
    const container = screen.getByTestId('pin-container')
    setSize(container, { clientWidth: 300, scrollLeft: 0 })
    act(() => vi.runAllTimers())

    expect(screen.getByTestId('cell-a').style.transform).toBe('')
  })

  test('generates scroll-cue box-shadow rules keyed on aria-colindex, scoped to the instance', () => {
    render(
      <Harness
        columns={[
          { id: 'a', defaultWidth: 100, pin: 'start' },
          { id: 'b', defaultWidth: 80, pin: 'end' }
        ]}
      />
    )
    // A <style> tag has no ARIA role and isn't reachable by an accessible query.
    // eslint-disable-next-line testing-library/no-node-access
    const style = screen.getByTestId('pin-container').querySelector('style')
    expect(style).toBeInTheDocument()
    const css = style?.textContent ?? ''
    expect(css).toContain('.test.datagrid-scrolled-start [aria-colindex="1"]')
    expect(css).toContain('.test.datagrid-scrolled-end [aria-colindex="2"]')
    // The z-index moved out of this stylesheet: it's set inline alongside the transform, since the
    // virtualizer writes the wrapper's own z-index inline too.
    expect(css).not.toContain('z-index')
  })

  test('raises the pinned wrapper above the cells it overlaps', () => {
    render(
      <Harness
        columns={[
          { id: 'a', defaultWidth: 100 },
          { id: 'b', defaultWidth: 80, pin: 'end' }
        ]}
      />
    )
    setSize(screen.getByTestId('pin-container'), { clientWidth: 300, scrollLeft: 0 })

    act(() => vi.runAllTimers())

    expect(screen.getByTestId('cell-b')).toHaveStyle({ zIndex: '2' })
  })

  test('positions a pin="end" column when the columns before it are not mounted', () => {
    // The layout engine windows columns horizontally as well as rows, so a wide grid's row holds
    // only the cells intersecting the viewport. Counting DOM children — as this used to — would
    // pick a different cell entirely once anything ahead of the pinned column unmounted.
    render(
      <Harness
        columns={[
          { id: 'a', defaultWidth: 100 },
          { id: 'b', defaultWidth: 100 },
          { id: 'c', defaultWidth: 100 },
          { id: 'd', defaultWidth: 80, pin: 'end' }
        ]}
        mountedColumns={[2, 3]}
      />
    )
    setSize(screen.getByTestId('pin-container'), { clientWidth: 400, scrollLeft: 60 })

    act(() => vi.runAllTimers())

    // offset(d) = 300, width(d) = 80 -> rightEdge = 380; rightOffset = 0
    // delta = 400 - 0 - 380 + 60 = 80
    expect(screen.getByTestId('cell-d')).toHaveStyle({ transform: 'translateX(80px)' })
    expect(screen.getByTestId('cell-c').style.transform).toBe('')
  })

  test('hands back the styles it set when a column stops being pinned', () => {
    const columns: HarnessColumn[] = [
      { id: 'a', defaultWidth: 100 },
      { id: 'b', defaultWidth: 80, pin: 'end' }
    ]
    const { rerender } = render(<Harness columns={columns} />)
    setSize(screen.getByTestId('pin-container'), { clientWidth: 300, scrollLeft: 0 })
    act(() => vi.runAllTimers())
    expect(screen.getByTestId('cell-b').style.transform).not.toBe('')

    rerender(
      <Harness
        columns={[
          { id: 'a', defaultWidth: 100 },
          { id: 'b', defaultWidth: 80 }
        ]}
      />
    )
    act(() => vi.runAllTimers())

    // Left set, the cell would stay stuck at the offset its last pinned sync computed.
    expect(screen.getByTestId('cell-b').style.transform).toBe('')
    expect(screen.getByTestId('cell-b').style.zIndex).toBe('')
  })
})

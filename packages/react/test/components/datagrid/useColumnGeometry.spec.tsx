import * as React from 'react'
import { useRef } from 'react'
import { act, render, screen } from '@testing-library/react'

import {
  calculateStaticColumnOffsets,
  isStaticColumnSize,
  useColumnGeometry,
  ColumnGeometryColumn,
  ColumnOffset
} from '../../../src/components/datagrid/useColumnGeometry'

describe('isStaticColumnSize', () => {
  test('accepts plain numbers, numeric strings, and percentages', () => {
    expect(isStaticColumnSize(150)).toBe(true)
    expect(isStaticColumnSize('150')).toBe(true)
    expect(isStaticColumnSize('50%')).toBe(true)
    expect(isStaticColumnSize('33.5%')).toBe(true)
  })

  test('rejects fr units and empty values', () => {
    expect(isStaticColumnSize('1fr')).toBe(false)
    expect(isStaticColumnSize('2fr')).toBe(false)
    expect(isStaticColumnSize(null)).toBe(false)
    expect(isStaticColumnSize(undefined)).toBe(false)
  })
})

describe('calculateStaticColumnOffsets', () => {
  test('accumulates offsets across plain-number widths', () => {
    const columns: ColumnGeometryColumn[] = [
      { id: 'a', defaultWidth: 100 },
      { id: 'b', defaultWidth: 50 },
      { id: 'c', defaultWidth: 200 }
    ]

    const offsets = calculateStaticColumnOffsets(columns, 800)

    expect(offsets.get('a')).toEqual({ id: 'a', offset: 0, width: 100 })
    expect(offsets.get('b')).toEqual({ id: 'b', offset: 100, width: 50 })
    expect(offsets.get('c')).toEqual({ id: 'c', offset: 150, width: 200 })
  })

  test('resolves percentage widths against the given container width', () => {
    const columns: ColumnGeometryColumn[] = [
      { id: 'a', defaultWidth: '25%' },
      { id: 'b', defaultWidth: '25%' }
    ]

    const offsets = calculateStaticColumnOffsets(columns, 400)

    expect(offsets.get('a')).toEqual({ id: 'a', offset: 0, width: 100 })
    expect(offsets.get('b')).toEqual({ id: 'b', offset: 100, width: 100 })
  })

  test('clamps a resolved width to minWidth/maxWidth when they are static', () => {
    const columns: ColumnGeometryColumn[] = [
      { id: 'a', defaultWidth: 40, minWidth: 75 },
      { id: 'b', defaultWidth: 300, maxWidth: 150 }
    ]

    const offsets = calculateStaticColumnOffsets(columns, 800)

    expect(offsets.get('a')).toEqual({ id: 'a', offset: 0, width: 75 })
    expect(offsets.get('b')).toEqual({ id: 'b', offset: 75, width: 150 })
  })

  test('returns null for an fr-sized column and every column after it', () => {
    const columns: ColumnGeometryColumn[] = [
      { id: 'a', defaultWidth: 100 },
      { id: 'b', defaultWidth: '1fr' },
      { id: 'c', defaultWidth: 100 }
    ]

    const offsets = calculateStaticColumnOffsets(columns, 800)

    expect(offsets.get('a')).toEqual({ id: 'a', offset: 0, width: 100 })
    expect(offsets.get('b')).toBeNull()
    expect(offsets.get('c')).toBeNull()
  })

  test('treats a column with no defaultWidth as non-static (defaults to 1fr)', () => {
    const columns: ColumnGeometryColumn[] = [{ id: 'a' }]

    const offsets = calculateStaticColumnOffsets(columns, 800)

    expect(offsets.get('a')).toBeNull()
  })

  test('returns an empty map for no columns', () => {
    expect(calculateStaticColumnOffsets([], 800).size).toBe(0)
  })
})

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
    this.callback([] as ResizeObserverEntry[], this as unknown as ResizeObserver)
  }
}

interface ProbeProps {
  columns: ColumnGeometryColumn[]
  /**
   * The 0-based column positions to actually mount a header cell for, mirroring the layout
   * engine's horizontal windowing. Defaults to all of them.
   */
  mountedColumns?: number[]
  onGeometry: (geometry: Map<string, ColumnOffset>) => void
}

const ColumnGeometryProbe = ({ columns, mountedColumns, onGeometry }: ProbeProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const geometry = useColumnGeometry(columns, containerRef)
  onGeometry(geometry as Map<string, ColumnOffset>)

  return (
    <div ref={containerRef}>
      {columns.map((column, index) =>
        mountedColumns && !mountedColumns.includes(index) ? null : (
          // `aria-colindex` is 1-based and set from the column's position in the resolved
          // collection — react-aria-components puts it on every header cell it renders, and it's
          // how the hook maps a mounted cell back to its column.
          <div aria-colindex={index + 1} key={String(column.id)} role="columnheader" />
        )
      )}
    </div>
  )
}

describe('useColumnGeometry', () => {
  const originalResizeObserver = globalThis.ResizeObserver

  beforeEach(() => {
    MockResizeObserver.instances = []
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof globalThis.ResizeObserver
  })

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver
  })

  test('resolves statically-sized columns without measuring the DOM', () => {
    const columns: ColumnGeometryColumn[] = [
      { id: 'a', defaultWidth: 100 },
      { id: 'b', defaultWidth: 50 }
    ]
    let latest: Map<string, ColumnOffset> = new Map()

    render(<ColumnGeometryProbe columns={columns} onGeometry={(geometry) => (latest = geometry)} />)

    expect(latest.get('a')).toEqual({ id: 'a', offset: 0, width: 100 })
    expect(latest.get('b')).toEqual({ id: 'b', offset: 100, width: 50 })
  })

  test('falls back to measured DOM rects for fr-sized columns', () => {
    const columns: ColumnGeometryColumn[] = [{ id: 'a', defaultWidth: '1fr' }]
    let latest: Map<string, ColumnOffset> = new Map()

    render(<ColumnGeometryProbe columns={columns} onGeometry={(geometry) => (latest = geometry)} />)

    const cell = screen.getByRole('columnheader')
    Object.defineProperty(cell, 'offsetLeft', { value: 40, configurable: true })
    Object.defineProperty(cell, 'offsetWidth', { value: 320, configurable: true })

    act(() => {
      MockResizeObserver.instances.forEach((instance) => instance.trigger())
    })

    expect(latest.get('a')).toEqual({ id: 'a', offset: 40, width: 320 })
  })

  test('matches a measured header to its own column when earlier columns are unmounted', () => {
    // The layout engine windows columns horizontally, so only the headers intersecting the
    // horizontal viewport are in the DOM — here columns 0 and 1 are scrolled out of view. Matching
    // the two mounted headers positionally would attribute their rects to columns 0 and 1.
    const columns: ColumnGeometryColumn[] = [
      { id: 'a', defaultWidth: '1fr' },
      { id: 'b', defaultWidth: '1fr' },
      { id: 'c', defaultWidth: '1fr' },
      { id: 'd', defaultWidth: '1fr' }
    ]
    let latest: Map<string, ColumnOffset> = new Map()

    render(
      <ColumnGeometryProbe
        columns={columns}
        mountedColumns={[2, 3]}
        onGeometry={(geometry) => (latest = geometry)}
      />
    )

    const [cellC, cellD] = screen.getAllByRole('columnheader')
    Object.defineProperty(cellC, 'offsetLeft', { value: 200, configurable: true })
    Object.defineProperty(cellC, 'offsetWidth', { value: 100, configurable: true })
    Object.defineProperty(cellD, 'offsetLeft', { value: 300, configurable: true })
    Object.defineProperty(cellD, 'offsetWidth', { value: 100, configurable: true })

    act(() => {
      MockResizeObserver.instances.forEach((instance) => instance.trigger())
    })

    expect(latest.get('c')).toEqual({ id: 'c', offset: 200, width: 100 })
    expect(latest.get('d')).toEqual({ id: 'd', offset: 300, width: 100 })
    expect(latest.has('a')).toBe(false)
    expect(latest.has('b')).toBe(false)
  })

  test('does not throw when ResizeObserver is unavailable', () => {
    globalThis.ResizeObserver = undefined as unknown as typeof globalThis.ResizeObserver
    const columns: ColumnGeometryColumn[] = [{ id: 'a', defaultWidth: '1fr' }]

    expect(() =>
      render(<ColumnGeometryProbe columns={columns} onGeometry={() => {}} />)
    ).not.toThrow()
  })
})

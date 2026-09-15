import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
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
  { id: '1', name: 'Mark' },
  { id: '2', name: 'Jacob' }
]

// `useLoadMoreSentinel` (react-aria-components) drives the loader row's `onLoadMore` callback via
// a real `IntersectionObserver`, which jsdom doesn't implement. This mock stands in for the
// browser, tracking observed elements per instance and letting a test fire an intersection entry
// on demand. `disconnect()` removes the instance from `instances` — `useLoadMoreSentinel` tears
// down and recreates its observer whenever the collection changes (e.g. after `isLoading`
// toggles), so a stale, no-longer-connected instance must not keep firing in a test that fires
// every tracked instance.
class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IntersectionObserverCallback
  observed: Element[] = []

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  observe(target: Element) {
    this.observed.push(target)
  }

  unobserve() {}

  disconnect() {
    const index = MockIntersectionObserver.instances.indexOf(this)
    if (index !== -1) MockIntersectionObserver.instances.splice(index, 1)
  }

  fire(isIntersecting: boolean) {
    const entries = this.observed.map(
      (target) => ({ target, isIntersecting }) as unknown as IntersectionObserverEntry
    )
    this.callback(entries, this as unknown as IntersectionObserver)
  }
}

describe('DataGridBody', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = []
    globalThis.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof globalThis.IntersectionObserver
  })

  describe('load more', () => {
    test('onLoadMore fires once per threshold crossing, not repeatedly while isLoading is true', () => {
      const onLoadMore = vi.fn()
      const Harness = () => {
        const [isLoading, setIsLoading] = React.useState(false)
        return (
          <DataGrid aria-label="Users" rowHeight={40}>
            <DataGridHeader>
              <DataGridColumn id="name" isRowHeader>
                Name
              </DataGridColumn>
            </DataGridHeader>
            <DataGridBody
              isLoading={isLoading}
              items={rows}
              onLoadMore={() => {
                onLoadMore()
                setIsLoading(true)
              }}
            >
              {(row) => (
                <DataGridRow id={row.id}>
                  <DataGridCell>{row.name}</DataGridCell>
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
        )
      }
      render(<Harness />)

      act(() => {
        MockIntersectionObserver.instances.forEach((instance) => instance.fire(true))
      })
      expect(onLoadMore).toHaveBeenCalledTimes(1)

      // A real sentinel re-observes (and immediately re-reports intersecting) whenever the
      // collection changes — firing again here simulates that, and must stay suppressed now that
      // the first call already flipped isLoading to true.
      act(() => {
        MockIntersectionObserver.instances.forEach((instance) => instance.fire(true))
      })
      expect(onLoadMore).toHaveBeenCalledTimes(1)
    })

    test('isLoading=false re-enables onLoadMore after a previous load finishes', () => {
      const onLoadMore = vi.fn()
      const Harness = ({ isLoading }: { isLoading: boolean }) => (
        <DataGrid aria-label="Users" rowHeight={40}>
          <DataGridHeader>
            <DataGridColumn id="name" isRowHeader>
              Name
            </DataGridColumn>
          </DataGridHeader>
          <DataGridBody isLoading={isLoading} items={rows} onLoadMore={onLoadMore}>
            {(row) => (
              <DataGridRow id={row.id}>
                <DataGridCell>{row.name}</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )
      const { rerender } = render(<Harness isLoading={false} />)

      act(() => {
        MockIntersectionObserver.instances.forEach((instance) => instance.fire(true))
      })
      expect(onLoadMore).toHaveBeenCalledTimes(1)

      // Still loading (fetch not resolved yet) — a repeat intersection must stay suppressed.
      rerender(<Harness isLoading />)
      act(() => {
        MockIntersectionObserver.instances.forEach((instance) => instance.fire(true))
      })
      expect(onLoadMore).toHaveBeenCalledTimes(1)

      // The fetch resolves and the sentinel is still on screen (more data to load).
      rerender(<Harness isLoading={false} />)
      act(() => {
        MockIntersectionObserver.instances.forEach((instance) => instance.fire(true))
      })
      expect(onLoadMore).toHaveBeenCalledTimes(2)
    })

    test('the loading affordance renders only while isLoading is true, and un-renders after', () => {
      const Harness = ({ isLoading }: { isLoading: boolean }) => (
        <DataGrid aria-label="Users" rowHeight={40}>
          <DataGridHeader>
            <DataGridColumn id="name" isRowHeader>
              Name
            </DataGridColumn>
          </DataGridHeader>
          <DataGridBody
            isLoading={isLoading}
            items={rows}
            loadingContent="Loading more…"
            onLoadMore={() => {}}
          >
            {(row) => (
              <DataGridRow id={row.id}>
                <DataGridCell>{row.name}</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )

      const { rerender } = render(<Harness isLoading={false} />)
      expect(screen.queryByText('Loading more…')).not.toBeInTheDocument()

      rerender(<Harness isLoading />)
      expect(screen.getByText('Loading more…')).toBeInTheDocument()

      rerender(<Harness isLoading={false} />)
      expect(screen.queryByText('Loading more…')).not.toBeInTheDocument()
    })

    test('the loader row does not add an extra accessible row or checkbox', () => {
      render(
        <DataGrid aria-label="Users" rowHeight={40} selectionMode="multiple">
          <DataGridHeader>
            <DataGridColumn className="datagrid-selection-cell" defaultWidth={44} minWidth={44}>
              <DataGridSelectAllCell />
            </DataGridColumn>
            <DataGridColumn id="name" isRowHeader>
              Name
            </DataGridColumn>
          </DataGridHeader>
          <DataGridBody isLoading={false} items={rows} onLoadMore={() => {}}>
            {(row) => (
              <DataGridRow id={row.id}>
                <DataGridCell className="datagrid-selection-cell">
                  <DataGridSelectionCell />
                </DataGridCell>
                <DataGridCell>{row.name}</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )

      // 1 header row + 2 data rows — the always-present, non-interactive sentinel row isn't
      // exposed with role="row".
      expect(screen.getAllByRole('row')).toHaveLength(3)
      // 1 select-all + 2 row checkboxes — no extra checkbox for the loader.
      expect(screen.getAllByRole('checkbox')).toHaveLength(3)
    })

    test('without onLoadMore, no loader row is added and items render exactly as before', () => {
      render(
        <DataGrid aria-label="Users" rowHeight={40}>
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
      expect(screen.getAllByRole('row')).toHaveLength(3)
      expect(MockIntersectionObserver.instances).toHaveLength(0)
    })

    test('has no axe violations with an active load-more row', async () => {
      const { container } = render(
        <DataGrid aria-label="Users" rowHeight={40}>
          <DataGridHeader>
            <DataGridColumn id="name" isRowHeader>
              Name
            </DataGridColumn>
          </DataGridHeader>
          <DataGridBody isLoading items={rows} loadingContent="Loading more…" onLoadMore={() => {}}>
            {(row) => (
              <DataGridRow id={row.id}>
                <DataGridCell>{row.name}</DataGridCell>
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )
      // react-aria-components' own TableLoadMoreItem (v1.20.0) unconditionally sets `aria-level`
      // on its row element (`"aria-level": item.level + 1` in its TableLoadingIndicator render,
      // apparently shared with its treegrid-row code path) — valid only on a treegrid row, not a
      // grid row, and DataGrid has no way to opt that attribute out from its own wrapping.
      // Reproduced with a vanilla react-aria-components `<Table>` + `<TableLoadMoreItem>` with no
      // DataGrid involved at all, confirming this is upstream, not something this wrapping causes.
      expect(
        await axe(container, { rules: { 'aria-conditional-attr': { enabled: false } } })
      ).toHaveNoViolations()
    })
  })
})

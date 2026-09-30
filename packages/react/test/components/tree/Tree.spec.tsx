import * as React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { renderToString } from 'react-dom/server'
import type { Key } from 'react-aria-components'

import { IconProvider, Tree, TreeItem } from '../../../src/index'
import type { IconComponentProps, TreeProps } from '../../../src/index'

const TestIcon = ({ name, ...props }: IconComponentProps) => (
  <i data-name={name} data-testid="icon" {...props} />
)
const iconNames = () => screen.queryAllByTestId('icon').map((icon) => icon.dataset.name)
const withTestIcons = (element: React.ReactElement) => (
  <IconProvider component={TestIcon}>{element}</IconProvider>
)

// A file tree: two folders, one with a folder inside, and a file at the root.
const files = (
  <>
    <TreeItem id="documents" label="Documents">
      <TreeItem id="report" label="Report.pdf" />
      <TreeItem id="notes" label="Notes.txt" />
      <TreeItem id="archive" label="Archive">
        <TreeItem id="2024" label="2024.zip" />
      </TreeItem>
    </TreeItem>
    <TreeItem id="pictures" label="Pictures">
      <TreeItem id="holiday" label="Holiday.jpg" />
    </TreeItem>
    <TreeItem id="readme" label="README.md" />
  </>
)

const Files = (props: Partial<TreeProps<object>>) => (
  <Tree aria-label="Files" {...props}>
    {files}
  </Tree>
)

const rows = () => screen.getAllByRole('row')
const rowNames = () => rows().map((row) => row.getAttribute('aria-label'))
const row = (name: string) => screen.getByRole('row', { name })
const toggle = (name: string) => screen.getByRole('button', { name })
const checkbox = (name: string) => screen.getByRole('checkbox', { name })
const getByClass = (className: string) =>
  screen.getByText((_, element) => element?.classList.contains(className) ?? false)
// The selection react-stately reports is a `Set` subclass with a cursor of its own, so it is
// compared by its keys.
const lastSelection = (spy: ReturnType<typeof vi.fn>) =>
  new Set(spy.mock.lastCall?.[0] as Iterable<Key>)

describe('Tree', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    // jsdom lays nothing out, and react-aria's keyboard navigation skips an item with no size: a
    // height makes every row count (as in `Menu.spec.tsx`).
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(1)
  })

  describe('rendering', () => {
    test('renders a treegrid of rows, one per visible item, with the level and position of each', () => {
      render(<Files defaultExpandedKeys={['documents']} />)
      const tree = screen.getByRole('treegrid', { name: 'Files' })
      expect(tree).toHaveClass('tree')
      expect(rowNames()).toEqual([
        'Documents',
        'Report.pdf',
        'Notes.txt',
        'Archive',
        'Pictures',
        'README.md'
      ])
      expect(row('Documents')).toHaveAttribute('aria-level', '1')
      expect(row('Documents')).toHaveAttribute('aria-posinset', '1')
      expect(row('Documents')).toHaveAttribute('aria-setsize', '3')
      expect(row('Notes.txt')).toHaveAttribute('aria-level', '2')
      expect(row('Notes.txt')).toHaveAttribute('aria-posinset', '2')
      expect(row('Notes.txt')).toHaveAttribute('aria-setsize', '3')
      expect(row('Notes.txt')).toHaveStyle({ '--cx-tree-level': '2' })
      rows().forEach((element) => expect(element).toHaveClass('tree-item'))
    })

    test('marks an item with child items expanded or collapsed, and gives it a chevron', () => {
      render(<Files defaultExpandedKeys={['documents']} />)
      expect(row('Documents')).toHaveAttribute('aria-expanded', 'true')
      expect(row('Documents')).toHaveClass('expanded')
      expect(row('Pictures')).toHaveAttribute('aria-expanded', 'false')
      expect(row('Pictures')).not.toHaveClass('expanded')
      expect(row('README.md')).not.toHaveAttribute('aria-expanded')

      const button = toggle('Collapse Documents')
      expect(row('Documents')).toContainElement(button)
      expect(button).toHaveClass('tree-item-toggle')
      expect(button).toHaveAttribute('tabindex', '-1')
      expect(row('Pictures')).toContainElement(toggle('Expand Pictures'))
      expect(within(row('README.md')).queryByRole('button')).not.toBeInTheDocument()
      expect(
        within(row('README.md')).getByText(
          (_, element) => element?.classList.contains('tree-item-spacer') ?? false
        )
      ).toBeInTheDocument()
    })

    test("draws IconProvider's expand icon in the chevron, flipped under RTL, or the tree's expandIcon", () => {
      const { unmount: unmountFirst } = render(withTestIcons(<Files />))
      expect(iconNames()).toEqual(['chevron-right-outline', 'chevron-right-outline'])
      expect(screen.getAllByTestId('icon')[0]).toHaveClass('tree-item-toggle-icon')
      expect(screen.getAllByTestId('icon')[0]).toHaveAttribute('aria-hidden', 'true')

      unmountFirst()
      const { unmount: unmountSecond } = render(
        withTestIcons(<Files expandIcon="chevron-down-outline" />)
      )
      expect(iconNames()).toEqual(['chevron-down-outline', 'chevron-down-outline'])

      unmountSecond()
      render(
        <IconProvider component={TestIcon} icons={{ expand: 'caret-right-solid' }}>
          <Files />
        </IconProvider>
      )
      expect(iconNames()).toEqual(['caret-right-solid', 'caret-right-solid'])
    })

    test("draws an item's icon before its label, hidden from assistive tech", () => {
      render(
        <Tree aria-label="Files">
          <TreeItem icon={<i data-testid="folder" />} id="documents" label="Documents" />
        </Tree>
      )
      const icon = getByClass('tree-item-icon')
      expect(icon).toContainElement(screen.getByTestId('folder'))
      expect(icon).toHaveAttribute('aria-hidden', 'true')
      expect(row('Documents')).toContainElement(icon)
      expect(screen.getByText('Documents')).toHaveClass('tree-item-label')
    })

    test("adds the caller's className and style to the tree and to an item", () => {
      render(
        <Tree aria-label="Files" className="custom" style={{ width: 200 }}>
          <TreeItem className="item-custom" id="a" label="A" style={{ color: 'red' }} />
        </Tree>
      )
      const tree = screen.getByRole('treegrid')
      expect(tree).toHaveClass('tree', 'custom')
      expect(tree).toHaveStyle({ width: '200px' })
      expect(row('A')).toHaveClass('tree-item', 'item-custom')
      expect(row('A')).toHaveStyle({ color: 'rgb(255, 0, 0)', '--cx-tree-level': '1' })
    })

    test('names a row by its label, or by textValue when the label is not text', () => {
      render(
        <Tree aria-label="Files">
          <TreeItem id="a" label="Plain" />
          <TreeItem id="b" label={<em>Rich</em>} textValue="Rich text" />
        </Tree>
      )
      expect(row('Plain')).toBeInTheDocument()
      expect(row('Rich text')).toContainElement(screen.getByText('Rich'))
    })

    test('renders the empty state in place of the items', () => {
      render(
        <Tree aria-label="Files" renderEmptyState={() => 'Nothing here.'}>
          {[]}
        </Tree>
      )
      expect(screen.getByRole('treegrid', { name: 'Files' })).toContainElement(
        screen.getByText('Nothing here.')
      )
    })
  })

  describe('expanding and collapsing', () => {
    test('the chevron toggles an item and reports the expanded keys', async () => {
      const onExpandedChange = vi.fn()
      render(<Files onExpandedChange={onExpandedChange} />)
      expect(rowNames()).toEqual(['Documents', 'Pictures', 'README.md'])

      await user.click(toggle('Expand Documents'))
      expect(onExpandedChange).toHaveBeenLastCalledWith(new Set(['documents']))
      expect(rowNames()).toEqual([
        'Documents',
        'Report.pdf',
        'Notes.txt',
        'Archive',
        'Pictures',
        'README.md'
      ])

      await user.click(toggle('Expand Archive'))
      expect(onExpandedChange).toHaveBeenLastCalledWith(new Set(['documents', 'archive']))
      expect(rowNames()).toContain('2024.zip')

      await user.click(toggle('Collapse Documents'))
      expect(onExpandedChange).toHaveBeenLastCalledWith(new Set(['archive']))
      expect(rowNames()).toEqual(['Documents', 'Pictures', 'README.md'])
    })

    test('the right and left arrow keys expand and collapse the focused item, and Left on a child goes to its parent', async () => {
      render(<Files />)
      await user.tab()
      expect(row('Documents')).toHaveFocus()

      await user.keyboard('{ArrowRight}')
      expect(row('Documents')).toHaveAttribute('aria-expanded', 'true')
      await user.keyboard('{ArrowDown}')
      expect(row('Report.pdf')).toHaveFocus()

      await user.keyboard('{ArrowLeft}')
      expect(row('Documents')).toHaveFocus()
      expect(row('Documents')).toHaveAttribute('aria-expanded', 'true')
      await user.keyboard('{ArrowLeft}')
      expect(row('Documents')).toHaveAttribute('aria-expanded', 'false')
    })

    test('a click on the row toggles it when the tree has no selection and no action', async () => {
      render(<Files />)
      await user.click(row('Documents'))
      expect(row('Documents')).toHaveAttribute('aria-expanded', 'true')
      await user.click(row('Documents'))
      expect(row('Documents')).toHaveAttribute('aria-expanded', 'false')
    })

    test('expandedKeys is controlled: the tree asks, the caller decides', async () => {
      const onExpandedChange = vi.fn()
      const { rerender } = render(
        <Files expandedKeys={['pictures']} onExpandedChange={onExpandedChange} />
      )
      expect(rowNames()).toEqual(['Documents', 'Pictures', 'Holiday.jpg', 'README.md'])

      await user.click(toggle('Expand Documents'))
      expect(onExpandedChange).toHaveBeenCalledWith(new Set(['pictures', 'documents']))
      expect(rowNames()).toEqual(['Documents', 'Pictures', 'Holiday.jpg', 'README.md'])

      rerender(<Files expandedKeys={['documents']} onExpandedChange={onExpandedChange} />)
      expect(rowNames()).toEqual([
        'Documents',
        'Report.pdf',
        'Notes.txt',
        'Archive',
        'Pictures',
        'README.md'
      ])
    })
  })

  describe('keyboard navigation', () => {
    test('the arrow keys, Home and End move between the visible rows, and a letter finds one', async () => {
      render(<Files defaultExpandedKeys={['documents']} />)
      await user.tab()
      expect(row('Documents')).toHaveFocus()

      await user.keyboard('{ArrowDown}')
      expect(row('Report.pdf')).toHaveFocus()
      await user.keyboard('{End}')
      expect(row('README.md')).toHaveFocus()
      await user.keyboard('{ArrowUp}')
      expect(row('Pictures')).toHaveFocus()
      await user.keyboard('{Home}')
      expect(row('Documents')).toHaveFocus()

      await user.keyboard('n')
      expect(row('Notes.txt')).toHaveFocus()
    })

    test('autoFocus focuses the first item, or the last', () => {
      const { unmount } = render(<Files autoFocus />)
      expect(row('Documents')).toHaveFocus()
      unmount()
      render(<Files autoFocus="last" />)
      expect(row('README.md')).toHaveFocus()
    })

    test('the tree is one tab stop: Tab leaves it, and Shift+Tab returns to the focused row', async () => {
      render(
        <>
          <Files defaultExpandedKeys={['documents']} />
          <button type="button">After</button>
        </>
      )
      await user.tab()
      await user.keyboard('{ArrowDown}')
      expect(row('Report.pdf')).toHaveFocus()
      await user.tab()
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
      await user.tab({ shift: true })
      expect(row('Report.pdf')).toHaveFocus()
    })
  })

  describe('selection', () => {
    test('single: a click selects one item, marked active, and replaces the previous one', async () => {
      const onSelectionChange = vi.fn()
      render(
        <Files
          defaultExpandedKeys={['documents']}
          onSelectionChange={onSelectionChange}
          selectionMode="single"
        />
      )
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()

      await user.click(row('Report.pdf'))
      expect(lastSelection(onSelectionChange)).toEqual(new Set(['report']))
      expect(row('Report.pdf')).toHaveAttribute('aria-selected', 'true')
      expect(row('Report.pdf')).toHaveClass('active')

      await user.click(row('Notes.txt'))
      expect(lastSelection(onSelectionChange)).toEqual(new Set(['notes']))
      expect(row('Report.pdf')).toHaveAttribute('aria-selected', 'false')
      expect(row('Report.pdf')).not.toHaveClass('active')
      expect(row('Notes.txt')).toHaveClass('active')

      await user.click(row('Notes.txt'))
      expect(lastSelection(onSelectionChange)).toEqual(new Set())
    })

    test('multiple: a checkbox per item, named after it, and a click toggles the item', async () => {
      const onSelectionChange = vi.fn()
      render(
        <Files
          defaultExpandedKeys={['documents']}
          onSelectionChange={onSelectionChange}
          selectionMode="multiple"
        />
      )
      expect(screen.getByRole('treegrid')).toHaveAttribute('aria-multiselectable', 'true')
      const box = checkbox('Select Report.pdf')
      expect(row('Report.pdf')).toContainElement(box)
      expect(box).toHaveClass('check-input', 'tree-item-check')
      expect(box).not.toHaveAttribute('aria-describedby')

      await user.click(box)
      expect(lastSelection(onSelectionChange)).toEqual(new Set(['report']))
      expect(box).toBeChecked()

      await user.click(row('Notes.txt'))
      expect(lastSelection(onSelectionChange)).toEqual(new Set(['report', 'notes']))
      expect(checkbox('Select Notes.txt')).toBeChecked()
      expect(row('Notes.txt')).toHaveClass('active')

      await user.click(box)
      expect(lastSelection(onSelectionChange)).toEqual(new Set(['notes']))
      expect(box).not.toBeChecked()
    })

    test('checkboxes turns the checkbox off for a multiple selection, and on for a single one', () => {
      const { unmount: unmountFirst } = render(
        <Files checkboxes={false} selectionMode="multiple" />
      )
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
      unmountFirst()
      const { unmount: unmountSecond } = render(<Files checkboxes selectionMode="single" />)
      expect(screen.getAllByRole('checkbox')).toHaveLength(3)
      unmountSecond()
      const { unmount: unmountThird } = render(<Files checkboxes />)
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
      unmountThird()
      render(<Files selectionBehavior="replace" selectionMode="multiple" />)
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })

    test('selectedKeys is controlled, and "all" selects every item', async () => {
      const onSelectionChange = vi.fn()
      const { rerender } = render(
        <Files
          onSelectionChange={onSelectionChange}
          selectedKeys={['pictures']}
          selectionMode="multiple"
        />
      )
      expect(row('Pictures')).toHaveAttribute('aria-selected', 'true')
      expect(row('Documents')).toHaveAttribute('aria-selected', 'false')

      await user.click(row('Documents'))
      expect(lastSelection(onSelectionChange)).toEqual(new Set(['pictures', 'documents']))
      expect(row('Documents')).toHaveAttribute('aria-selected', 'false')

      rerender(
        <Files onSelectionChange={onSelectionChange} selectedKeys="all" selectionMode="multiple" />
      )
      rows().forEach((element) => expect(element).toHaveAttribute('aria-selected', 'true'))
    })

    test('disallowEmptySelection keeps the last selected item', async () => {
      render(
        <Files defaultSelectedKeys={['readme']} disallowEmptySelection selectionMode="single" />
      )
      await user.click(row('README.md'))
      expect(row('README.md')).toHaveAttribute('aria-selected', 'true')
    })

    test('Space and Enter select the focused row', async () => {
      const onSelectionChange = vi.fn()
      render(<Files onSelectionChange={onSelectionChange} selectionMode="multiple" />)
      await user.tab()
      await user.keyboard(' ')
      expect(lastSelection(onSelectionChange)).toEqual(new Set(['documents']))
      await user.keyboard('{ArrowDown}{Enter}')
      expect(lastSelection(onSelectionChange)).toEqual(new Set(['documents', 'pictures']))
    })
  })

  describe('disabled items', () => {
    test("disabledKeys and an item's disabled mark it, and keep it out of selection and focus", async () => {
      const onSelectionChange = vi.fn()
      render(
        <Tree
          aria-label="Files"
          disabledKeys={['b']}
          onSelectionChange={onSelectionChange}
          selectionMode="single"
        >
          <TreeItem id="a" label="A" />
          <TreeItem id="b" label="B" />
          <TreeItem disabled id="c" label="C" />
          <TreeItem id="d" label="D" />
        </Tree>
      )
      expect(row('B')).toHaveClass('disabled')
      expect(row('C')).toHaveClass('disabled')
      expect(row('A')).not.toHaveClass('disabled')

      await user.click(row('B'))
      await user.click(row('C'))
      expect(onSelectionChange).not.toHaveBeenCalled()

      await user.click(row('A'))
      await user.keyboard('{ArrowDown}')
      expect(row('D')).toHaveFocus()
    })

    test("a disabled item's chevron is disabled too", async () => {
      const onExpandedChange = vi.fn()
      render(<Files disabledKeys={['pictures']} onExpandedChange={onExpandedChange} />)
      expect(toggle('Expand Pictures')).toBeDisabled()
      expect(toggle('Expand Documents')).toBeEnabled()
      await user.click(toggle('Expand Pictures'))
      expect(onExpandedChange).not.toHaveBeenCalled()
    })

    test('disabledBehavior="selection" leaves a disabled item focusable and expandable', async () => {
      render(
        <Files disabledBehavior="selection" disabledKeys={['documents']} selectionMode="single" />
      )
      await user.tab()
      expect(row('Documents')).toHaveFocus()
      await user.keyboard('{ArrowRight}')
      expect(row('Documents')).toHaveAttribute('aria-expanded', 'true')
      await user.keyboard('{Enter}')
      expect(row('Documents')).not.toHaveAttribute('aria-selected', 'true')
      expect(row('Documents')).not.toHaveClass('active')
    })
  })

  describe('actions', () => {
    test("Enter, and a click when nothing is selectable, call the tree's and the item's onAction", async () => {
      const onAction = vi.fn()
      const onItemAction = vi.fn()
      render(
        <Tree aria-label="Files" onAction={onAction}>
          <TreeItem id="a" label="A" onAction={onItemAction} />
          <TreeItem id="b" label="B">
            <TreeItem id="c" label="C" />
          </TreeItem>
        </Tree>
      )
      await user.click(row('A'))
      expect(onAction).toHaveBeenLastCalledWith('a')
      expect(onItemAction).toHaveBeenCalledTimes(1)

      await user.keyboard('{ArrowDown}{Enter}')
      expect(onAction).toHaveBeenLastCalledWith('b')
      // An action replaces the toggle a click would otherwise be.
      expect(row('B')).toHaveAttribute('aria-expanded', 'false')
      expect(onItemAction).toHaveBeenCalledTimes(1)
    })

    test('with a selection, a click activates while nothing is selected, then selects', async () => {
      const onAction = vi.fn()
      const onSelectionChange = vi.fn()
      render(
        <Files onAction={onAction} onSelectionChange={onSelectionChange} selectionMode="multiple" />
      )
      await user.click(row('README.md'))
      expect(onAction).toHaveBeenLastCalledWith('readme')
      expect(onSelectionChange).not.toHaveBeenCalled()

      await user.click(checkbox('Select README.md'))
      expect(lastSelection(onSelectionChange)).toEqual(new Set(['readme']))
      await user.click(row('Documents'))
      expect(lastSelection(onSelectionChange)).toEqual(new Set(['readme', 'documents']))
      expect(onAction).toHaveBeenCalledTimes(1)

      // Space toggles the focused item too, and Enter activates nothing until the selection is
      // empty again.
      await waitFor(() => expect(row('Documents')).toHaveFocus())
      await user.keyboard(' ')
      expect(lastSelection(onSelectionChange)).toEqual(new Set(['readme']))
      await user.keyboard('{Enter}')
      expect(onAction).toHaveBeenCalledTimes(1)
    })

    test('selectionBehavior="replace": a click selects the item alone, a double click activates it', async () => {
      const onAction = vi.fn()
      const onSelectionChange = vi.fn()
      render(
        <Files
          defaultSelectedKeys={['pictures']}
          onAction={onAction}
          onSelectionChange={onSelectionChange}
          selectionBehavior="replace"
          selectionMode="multiple"
        />
      )
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
      await user.click(row('README.md'))
      expect(lastSelection(onSelectionChange)).toEqual(new Set(['readme']))
      expect(onAction).not.toHaveBeenCalled()
      await user.dblClick(row('README.md'))
      expect(onAction).toHaveBeenLastCalledWith('readme')
    })
  })

  describe('data', () => {
    interface Entry {
      id: string
      name: string
      contents?: Entry[]
    }
    const entries: Entry[] = [
      {
        id: 'src',
        name: 'src',
        contents: [
          { id: 'components', name: 'components', contents: [{ id: 'tree', name: 'Tree.tsx' }] },
          { id: 'index', name: 'index.ts' }
        ]
      },
      { id: 'package', name: 'package.json' }
    ]
    const renderEntry = (entry: Entry) => (
      <TreeItem items={entry.contents} label={entry.name} textValue={entry.name}>
        {renderEntry}
      </TreeItem>
    )

    test('renders items through the render function, at every level, keyed by their ids', async () => {
      const onExpandedChange = vi.fn()
      render(
        <Tree
          aria-label="Project"
          defaultExpandedKeys={['src']}
          items={entries}
          onExpandedChange={onExpandedChange}
        >
          {renderEntry}
        </Tree>
      )
      expect(rowNames()).toEqual(['src', 'components', 'index.ts', 'package.json'])
      expect(row('components')).toHaveAttribute('aria-level', '2')
      expect(row('index.ts')).not.toHaveAttribute('aria-expanded')

      await user.click(toggle('Expand components'))
      expect(onExpandedChange).toHaveBeenLastCalledWith(new Set(['src', 'components']))
      expect(rowNames()).toEqual(['src', 'components', 'Tree.tsx', 'index.ts', 'package.json'])
      expect(row('Tree.tsx')).toHaveAttribute('aria-level', '3')
    })

    test('re-renders the items when the data, or a dependency, changes', () => {
      const Subject = ({ data, suffix }: { data: Entry[]; suffix: string }) => (
        <Tree aria-label="Project" dependencies={[suffix]} items={data}>
          {(entry: Entry) => <TreeItem label={`${entry.name}${suffix}`} textValue={entry.name} />}
        </Tree>
      )
      const { rerender } = render(<Subject data={entries} suffix="" />)
      expect(screen.getByText('src')).toBeInTheDocument()
      rerender(<Subject data={entries} suffix="!" />)
      expect(screen.getByText('src!')).toBeInTheDocument()
      rerender(<Subject data={[{ id: 'other', name: 'other' }]} suffix="!" />)
      expect(rowNames()).toEqual(['other'])
    })
  })

  describe('refs', () => {
    test('forwards a ref to the treegrid, and an item forwards one to its row', () => {
      const treeRef = React.createRef<HTMLDivElement>()
      const itemRef = React.createRef<HTMLDivElement>()
      render(
        <Tree aria-label="Files" ref={treeRef}>
          <TreeItem id="a" label="A" ref={itemRef} />
        </Tree>
      )
      expect(treeRef.current).toBe(screen.getByRole('treegrid'))
      expect(itemRef.current).toBe(row('A'))
    })
  })

  describe('server HTML', () => {
    test('holds the expanded items, and refers to no id it does not render', () => {
      // `view`: the lint's name for what a render returns, though this one is a string.
      const view = renderToString(
        <Files defaultExpandedKeys={['documents']} selectionMode="multiple" />
      )
      const container = document.createElement('div')
      container.innerHTML = view
      const names = within(container)
        .getAllByRole('row')
        .map((element) => element.getAttribute('aria-label'))
      expect(names).toEqual([
        'Documents',
        'Report.pdf',
        'Notes.txt',
        'Archive',
        'Pictures',
        'README.md'
      ])
      const referenced = [
        ...view.matchAll(/aria-(?:labelledby|describedby|controls)="([^"]*)"/g)
      ].flatMap(([, ids]) => (ids ?? '').split(' '))
      expect(referenced.length).toBeGreaterThan(0)
      for (const id of referenced) expect(view).toContain(`id="${id}"`)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with icons, an expanded item and a multiple selection', async () => {
      const { container } = render(
        <Tree
          aria-label="Files"
          defaultExpandedKeys={['documents']}
          defaultSelectedKeys={['report']}
          selectionMode="multiple"
        >
          <TreeItem icon={<i />} id="documents" label="Documents">
            <TreeItem icon={<i />} id="report" label="Report.pdf" />
            <TreeItem disabled icon={<i />} id="notes" label="Notes.txt" />
          </TreeItem>
          <TreeItem icon={<i />} id="readme" label="README.md" />
        </Tree>
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations with a single selection and no checkboxes', async () => {
      const { container } = render(
        <Files
          defaultExpandedKeys={['documents']}
          defaultSelectedKeys={['notes']}
          selectionMode="single"
        />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

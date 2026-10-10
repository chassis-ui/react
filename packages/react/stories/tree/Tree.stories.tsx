import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import type { Key, Selection } from 'react-aria-components'

import { Icon } from '../../src/components/icon/Icon'
import { Tree } from '../../src/components/tree/Tree'
import { TreeItem } from '../../src/components/tree/TreeItem'

// Storybook has no icon sprite, so these stories embed the symbols they draw, from chassis-icons:
// the screenshots then show the chevrons and the item icons.
const symbols = [
  [
    'chevron-right-outline',
    'M18.164 11.336c.352.39.352.976 0 1.328l-7.5 7.5c-.39.39-.976.39-1.328 0a.856.856 0 0 1 0-1.289l6.836-6.836-6.836-6.875a.855.855 0 0 1 0-1.289.855.855 0 0 1 1.289 0z'
  ],
  [
    'folder-solid',
    'M4.5 20.75a2.47 2.47 0 0 1-2.5-2.5V5.75c0-1.367 1.094-2.5 2.5-2.5h5c.781 0 1.523.39 1.992 1.016l.742 1.015c.235.313.586.469 1.016.469h6.25c1.367 0 2.5 1.133 2.5 2.5v10c0 1.406-1.133 2.5-2.5 2.5z'
  ],
  [
    'file-outline',
    'M17.5 20.125a.64.64 0 0 0 .625-.625V8.25H15c-.703 0-1.25-.547-1.25-1.25V3.875H7.5a.64.64 0 0 0-.625.625v15c0 .352.273.625.625.625zM5 4.5C5 3.133 6.094 2 7.5 2h6.445c.664 0 1.29.273 1.758.742l3.555 3.555c.469.469.742 1.094.742 1.758V19.5c0 1.406-1.133 2.5-2.5 2.5h-10A2.47 2.47 0 0 1 5 19.5z'
  ],
  [
    'chevron-down-outline',
    'M11.336 18.164a.856.856 0 0 0 1.289 0l7.5-7.5c.39-.39.39-.976 0-1.328a.856.856 0 0 0-1.289 0L12 16.172 5.125 9.336a.855.855 0 0 0-1.289 0c-.39.39-.39.976 0 1.328z'
  ]
]

// The sprite comes after the story: a tool that reads the first element of the canvas as the
// story (design-sync's capture does) would find a hidden `<svg>` and call the story empty.
const withIcons = (Story: () => React.ReactElement) => (
  <>
    <div style={{ maxWidth: '20rem' }}>
      <Story />
    </div>
    <svg aria-hidden="true" style={{ display: 'none' }}>
      {symbols.map(([id, path]) => (
        <symbol id={id} key={id} viewBox="0 0 24 24">
          <path d={path} />
        </symbol>
      ))}
    </svg>
  </>
)

const meta: Meta<typeof Tree> = {
  component: Tree,
  decorators: [withIcons],
  title: 'tree/Tree'
}

export default meta

type Story = StoryObj<typeof Tree>

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

// Expanding, collapsing and selecting, checked in the three real browsers: the chevron and the
// arrow keys toggle an item, a click selects one. The chevron is clicked by the element's own
// `click()`: it keeps focus off itself (react-aria's `preventFocusOnPress`), which the focus
// user-event emulates in a hidden document throws at.
export const Default: Story = {
  args: {
    'aria-label': 'Files',
    children: files,
    defaultExpandedKeys: ['documents'],
    onExpandedChange: fn(),
    onSelectionChange: fn(),
    selectionMode: 'single'
  },
  play: async function ({ args, canvas, userEvent }) {
    const rows = () => canvas.getAllByRole('row')
    // The rows follow the first render: react-aria-components builds the collection from the
    // children, then renders it.
    await waitFor(() =>
      expect(rows().map((row) => row.textContent)).toEqual([
        'Documents',
        'Report.pdf',
        'Notes.txt',
        'Archive',
        'Pictures',
        'README.md'
      ])
    )

    canvas.getByRole('button', { name: 'Expand Pictures' }).click()
    await waitFor(() => expect(rows()).toHaveLength(7))
    await expect(args.onExpandedChange).toHaveBeenLastCalledWith(new Set(['documents', 'pictures']))

    await userEvent.click(canvas.getByRole('row', { name: 'Holiday.jpg' }))
    await expect(canvas.getByRole('row', { name: 'Holiday.jpg' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    await expect(args.onSelectionChange).toHaveBeenCalledTimes(1)
    await expect([...(args.onSelectionChange as ReturnType<typeof fn>).mock.calls[0]![0]]).toEqual([
      'holiday'
    ])

    await userEvent.keyboard('{ArrowUp}{ArrowLeft}')
    await waitFor(() => expect(rows()).toHaveLength(6))
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(rows()).toHaveLength(7))

    // The state the visual regression spec waits for before its screenshot: two expanded items,
    // Holiday.jpg selected, Pictures focused.
    await expect(canvas.getByRole('row', { name: 'Pictures' })).toHaveFocus()
  }
}

export const Icons: Story = {
  args: {
    'aria-label': 'Files',
    defaultExpandedKeys: ['documents', 'archive'],
    children: (
      <>
        <TreeItem icon={<Icon name="folder-solid" />} id="documents" label="Documents">
          <TreeItem icon={<Icon name="file-outline" />} id="report" label="Report.pdf" />
          <TreeItem icon={<Icon name="folder-solid" />} id="archive" label="Archive">
            <TreeItem icon={<Icon name="file-outline" />} id="2024" label="2024.zip" />
          </TreeItem>
        </TreeItem>
        <TreeItem icon={<Icon name="folder-solid" />} id="pictures" label="Pictures">
          <TreeItem icon={<Icon name="file-outline" />} id="holiday" label="Holiday.jpg" />
        </TreeItem>
        <TreeItem icon={<Icon name="file-outline" />} id="readme" label="README.md" />
      </>
    )
  }
}

export const MultipleSelection: Story = {
  args: {
    'aria-label': 'Files',
    children: files,
    defaultExpandedKeys: ['documents', 'archive'],
    defaultSelectedKeys: ['report', '2024'],
    selectionMode: 'multiple'
  }
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Files',
    children: files,
    defaultExpandedKeys: ['documents'],
    disabledKeys: ['notes', 'pictures'],
    selectionMode: 'single'
  }
}

interface Entry {
  id: string
  name: string
  children?: Entry[]
}

const entries: Entry[] = [
  {
    id: 'src',
    name: 'src',
    children: [
      {
        id: 'components',
        name: 'components',
        children: [
          { id: 'tree', name: 'Tree.tsx' },
          { id: 'tree-item', name: 'TreeItem.tsx' }
        ]
      },
      { id: 'index', name: 'index.ts' }
    ]
  },
  { id: 'package', name: 'package.json' }
]

const renderEntry = (entry: Entry) => (
  <TreeItem items={entry.children} label={entry.name} textValue={entry.name}>
    {renderEntry}
  </TreeItem>
)

export const DataDriven: Story = {
  render: () => (
    <Tree aria-label="Project" defaultExpandedKeys={['src', 'components']} items={entries}>
      {renderEntry}
    </Tree>
  )
}

const ControlledTree = () => {
  const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set(['documents']))
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['notes']))
  return (
    <Tree
      aria-label="Files"
      expandedKeys={expandedKeys}
      onExpandedChange={setExpandedKeys}
      onSelectionChange={setSelectedKeys}
      selectedKeys={selectedKeys}
      selectionMode="single"
    >
      {files}
    </Tree>
  )
}

export const Controlled: Story = {
  render: () => <ControlledTree />
}

export const EmptyState: Story = {
  render: () => (
    <Tree aria-label="Files" renderEmptyState={() => 'No files yet.'}>
      {[]}
    </Tree>
  )
}

export const ExpandIcon: Story = {
  args: {
    'aria-label': 'Files',
    children: files,
    defaultExpandedKeys: ['documents'],
    expandIcon: 'chevron-down-outline'
  }
}

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Tree aria-label="ملفات" defaultExpandedKeys={['docs']}>
        <TreeItem id="docs" label="مستندات">
          <TreeItem id="report" label="تقرير.pdf" />
          <TreeItem id="archive" label="أرشيف">
            <TreeItem id="old" label="قديم.zip" />
          </TreeItem>
        </TreeItem>
        <TreeItem id="pictures" label="صور">
          <TreeItem id="holiday" label="عطلة.jpg" />
        </TreeItem>
      </Tree>
    </div>
  )
}

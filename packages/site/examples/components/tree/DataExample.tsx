import { Tree, TreeItem } from '@chassis-ui/react'

interface Entry {
  id: string
  name: string
  entries?: Entry[]
}

const project: Entry[] = [
  {
    id: 'src',
    name: 'src',
    entries: [
      {
        id: 'components',
        name: 'components',
        entries: [
          { id: 'tree', name: 'Tree.tsx' },
          { id: 'tree-item', name: 'TreeItem.tsx' }
        ]
      },
      { id: 'index', name: 'index.ts' }
    ]
  },
  { id: 'package', name: 'package.json' }
]

// The render function renders one entry, and passes itself on for the entry's own entries.
const renderEntry = (entry: Entry) => (
  <TreeItem items={entry.entries} label={entry.name} textValue={entry.name}>
    {renderEntry}
  </TreeItem>
)

export const Example = () => (
  <Tree aria-label="Project" defaultExpandedKeys={['src', 'components']} items={project}>
    {renderEntry}
  </Tree>
)

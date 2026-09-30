import { useState } from 'react'
import { Tree, TreeItem } from '@chassis-ui/react'
import type { Selection } from 'react-stately'

export const Example = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['report', '2024']))

  return (
    <div className="d-flex flex-column gap-sm">
      <Tree
        aria-label="Files"
        defaultExpandedKeys={['documents', 'archive']}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        onSelectionChange={setSelectedKeys}
      >
        <TreeItem id="documents" label="Documents">
          <TreeItem id="report" label="Report.pdf" />
          <TreeItem id="notes" label="Notes.txt" />
          <TreeItem id="archive" label="Archive">
            <TreeItem id="2024" label="2024.zip" />
          </TreeItem>
        </TreeItem>
        <TreeItem id="readme" label="README.md" />
      </Tree>
      <span>
        Selected: {selectedKeys === 'all' ? 'all' : [...selectedKeys].join(', ') || 'none'}
      </span>
    </div>
  )
}

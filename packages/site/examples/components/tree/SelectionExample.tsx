import { useState } from 'react'
import { Tree, TreeItem } from '@chassis-ui/react'
import type { Selection } from 'react-stately'

export const Example = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['notes']))

  return (
    <div className="d-flex flex-column gap-sm">
      <Tree
        aria-label="Files"
        defaultExpandedKeys={['documents']}
        disabledKeys={['pictures']}
        selectedKeys={selectedKeys}
        selectionMode="single"
        onSelectionChange={setSelectedKeys}
      >
        <TreeItem id="documents" label="Documents">
          <TreeItem id="report" label="Report.pdf" />
          <TreeItem id="notes" label="Notes.txt" />
        </TreeItem>
        <TreeItem id="pictures" label="Pictures">
          <TreeItem id="holiday" label="Holiday.jpg" />
        </TreeItem>
        <TreeItem id="readme" label="README.md" />
      </Tree>
      <span>
        Selected: {selectedKeys === 'all' ? 'all' : [...selectedKeys].join(', ') || 'none'}
      </span>
    </div>
  )
}

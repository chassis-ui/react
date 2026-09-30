import { useState } from 'react'
import { Tree, TreeItem } from '@chassis-ui/react'
import type { Key } from 'react-stately'

export const Example = () => {
  const [opened, setOpened] = useState<Key | null>(null)

  return (
    <div className="d-flex flex-column gap-sm">
      <Tree aria-label="Files" defaultExpandedKeys={['documents']} onAction={setOpened}>
        <TreeItem id="documents" label="Documents">
          <TreeItem id="report" label="Report.pdf" />
          <TreeItem id="notes" label="Notes.txt" />
        </TreeItem>
        <TreeItem id="readme" label="README.md" />
      </Tree>
      <span>Opened: {opened ?? 'nothing yet'}</span>
    </div>
  )
}

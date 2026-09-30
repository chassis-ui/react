import { useState } from 'react'
import { Button, Tree, TreeItem } from '@chassis-ui/react'
import type { Key } from 'react-stately'

const folders = ['documents', 'archive', 'pictures']

export const Example = () => {
  const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set(['documents']))

  return (
    <div className="d-flex flex-column gap-sm">
      <div className="d-flex gap-sm">
        <Button variant="outline" onClick={() => setExpandedKeys(new Set(folders))}>
          Expand all
        </Button>
        <Button variant="outline" onClick={() => setExpandedKeys(new Set())}>
          Collapse all
        </Button>
      </div>
      <Tree aria-label="Files" expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys}>
        <TreeItem id="documents" label="Documents">
          <TreeItem id="report" label="Report.pdf" />
          <TreeItem id="archive" label="Archive">
            <TreeItem id="2024" label="2024.zip" />
          </TreeItem>
        </TreeItem>
        <TreeItem id="pictures" label="Pictures">
          <TreeItem id="holiday" label="Holiday.jpg" />
        </TreeItem>
      </Tree>
    </div>
  )
}

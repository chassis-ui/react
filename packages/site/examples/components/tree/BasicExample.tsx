import { Tree, TreeItem } from '@chassis-ui/react'

export const Example = () => (
  <Tree aria-label="Files" defaultExpandedKeys={['documents']}>
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
  </Tree>
)

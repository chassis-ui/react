import { Icon, Tree, TreeItem } from '@chassis-ui/react'

const folder = <Icon name="folder-solid" />
const file = <Icon name="file-outline" />

export const Example = () => (
  <Tree aria-label="Files" defaultExpandedKeys={['documents', 'archive']}>
    <TreeItem icon={folder} id="documents" label="Documents">
      <TreeItem icon={file} id="report" label="Report.pdf" />
      <TreeItem icon={folder} id="archive" label="Archive">
        <TreeItem icon={file} id="2024" label="2024.zip" />
      </TreeItem>
    </TreeItem>
    <TreeItem icon={folder} id="pictures" label="Pictures">
      <TreeItem icon={file} id="holiday" label="Holiday.jpg" />
    </TreeItem>
    <TreeItem icon={file} id="readme" label="README.md" />
  </Tree>
)

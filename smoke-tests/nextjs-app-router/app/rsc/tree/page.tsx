import { Tree, TreeItem } from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'

// Static items only: `Tree`'s `items` with a render function can't be passed from a Server
// Component, as no function can. The expanded item's children are in the server's HTML.
export default function Page() {
  return (
    <main>
      <Tree aria-label="Files" defaultExpandedKeys={['documents']}>
        <TreeItem id="documents" label="Documents">
          <TreeItem
            id="report"
            label={
              <>
                Report.pdf <ClientMark />
              </>
            }
            textValue="Report.pdf"
          />
          <TreeItem id="notes" label="Notes.txt" />
        </TreeItem>
        <TreeItem id="pictures" label="Pictures">
          <TreeItem id="holiday" label="Holiday.jpg" />
        </TreeItem>
      </Tree>
    </main>
  )
}

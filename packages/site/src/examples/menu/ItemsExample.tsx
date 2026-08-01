import { CxIcon, CxMenu, CxMenuList, CxMenuToggle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxMenu>
      <CxMenuToggle color="secondary">Recent files</CxMenuToggle>
      <CxMenuList
        items={[
          { id: 'new', label: 'New file', href: '#' },
          { id: 'open', label: 'Open…', href: '#' },
          { type: 'divider', id: 'divider' },
          { type: 'header', id: 'recent', label: 'Recent' },
          {
            id: 'report',
            label: 'Quarterly report.docx',
            icon: <CxIcon name="file-circle-check-outline" size={16} />,
            href: '#'
          },
          {
            id: 'notes',
            label: 'Meeting notes.docx',
            icon: <CxIcon name="file-circle-check-outline" size={16} />,
            href: '#'
          }
        ]}
      />
    </CxMenu>
  )
}

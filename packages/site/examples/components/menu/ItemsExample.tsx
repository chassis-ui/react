import { Icon, Menu, MenuToggle, MenuList } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <MenuToggle color="secondary">Recent files</MenuToggle>
      <MenuList
        items={[
          { id: 'new', label: 'New file', href: '#' },
          { id: 'open', label: 'Open…', href: '#' },
          { type: 'divider', id: 'divider' },
          { type: 'header', id: 'recent', label: 'Recent' },
          {
            id: 'report',
            label: 'Quarterly report.docx',
            icon: <Icon name="file-circle-check-outline" size={16} />,
            href: '#'
          },
          {
            id: 'notes',
            label: 'Meeting notes.docx',
            icon: <Icon name="file-circle-check-outline" size={16} />,
            href: '#'
          }
        ]}
      />
    </Menu>
  )
}

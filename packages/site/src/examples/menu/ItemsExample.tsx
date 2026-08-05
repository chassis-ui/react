import { Icon, Menu } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <Menu.Toggle color="secondary">Recent files</Menu.Toggle>
      <Menu.List
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

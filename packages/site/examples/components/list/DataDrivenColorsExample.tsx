import { List } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List
      items={[
        { label: 'Default item' },
        { label: 'Primary item', color: 'primary' },
        { label: 'Success item', color: 'success' },
        { label: 'Danger item', color: 'danger' },
        { label: 'Warning item', color: 'warning' }
      ]}
    />
  )
}

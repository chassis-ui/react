import { List } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List
      items={[
        { label: 'Dashboard', href: '#', active: true },
        { label: 'Profile', href: '#' },
        { label: 'Settings', href: '#' },
        { label: 'Billing', href: '#', disabled: true }
      ]}
    />
  )
}

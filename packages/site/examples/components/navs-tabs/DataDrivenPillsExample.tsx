import { Nav } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Nav
      variant="pills"
      items={[
        { label: 'Active', href: '#', active: true },
        { label: 'Link', href: '#' },
        { label: 'Another Link', href: '#' },
        { label: 'Disabled', disabled: true }
      ]}
    />
  )
}

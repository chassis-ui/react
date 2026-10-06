import { Nav } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Nav
      variant="segments"
      items={[
        { label: 'Active', href: '#', active: true },
        { label: 'Link', href: '#' },
        { label: 'Another Link', href: '#' },
        { label: 'Disabled', href: '#', disabled: true }
      ]}
    />
  )
}

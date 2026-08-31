import { Nav } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Nav
      items={[
        { label: 'Home', href: '#', active: true },
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Disabled', href: '#', disabled: true }
      ]}
    />
  )
}

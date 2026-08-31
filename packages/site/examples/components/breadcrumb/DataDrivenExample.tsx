import { Breadcrumb } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', href: '/' },
        { label: 'Library', href: '/library' },
        { label: 'Data' }
      ]}
    />
  )
}

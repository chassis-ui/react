import { Select } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Select
      aria-label="Multiple select example"
      options={[
        { label: 'One', value: '1' },
        { label: 'Two', value: '2' },
        { label: 'Three', value: '3' }
      ]}
      multiple
    />
  )
}

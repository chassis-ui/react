import { CxSelect } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxSelect
      aria-label="Select size example"
      options={[
        { label: 'One', value: '1' },
        { label: 'Two', value: '2' },
        { label: 'Three', value: '3' }
      ]}
      htmlSize={3}
    />
  )
}

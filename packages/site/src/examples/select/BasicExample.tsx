import { CxSelect } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxSelect
      placeholder="Choose an option"
      aria-label="Basic select example"
      options={[
        { label: 'One', value: '1' },
        { label: 'Two', value: '2' },
        { label: 'Three', value: '3', disabled: true }
      ]}
    />
  )
}

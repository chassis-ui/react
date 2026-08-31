import { Select } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Select
        aria-label="Single selection example"
        options={[
          { label: 'One', value: '1' },
          { label: 'Two', value: '2', selected: true },
          { label: 'Three', value: '3' }
        ]}
      />
      <Select
        aria-label="Multiple selection example"
        multiple
        options={[
          { label: 'One', value: '1' },
          { label: 'Two', value: '2', selected: true },
          { label: 'Three', value: '3', selected: true }
        ]}
      />
    </>
  )
}

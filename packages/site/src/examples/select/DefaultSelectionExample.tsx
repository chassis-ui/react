import { CxSelect } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxSelect
        aria-label="Single selection example"
        options={[
          { label: 'One', value: '1' },
          { label: 'Two', value: '2', selected: true },
          { label: 'Three', value: '3' }
        ]}
      />
      <CxSelect
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

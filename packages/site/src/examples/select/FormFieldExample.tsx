import { CxSelect } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxSelect
      label="Country"
      help="Used to calculate shipping costs."
      options={[
        { label: 'Australia', value: 'au' },
        { label: 'Canada', value: 'ca' },
        { label: 'United Kingdom', value: 'gb' },
        { label: 'United States', value: 'us' }
      ]}
    />
  )
}

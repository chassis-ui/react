import { Select } from '@chassis-ui/react'

export const Example = () => {
  const options = [
    { label: 'Choose an option', value: '' },
    { label: 'One', value: '1' },
    { label: 'Two', value: '2' },
    { label: 'Three', value: '3', disabled: true }
  ]
  return (
    <>
      <Select size="lg" aria-label="Large select example" options={options} />
      <Select aria-label="Default select example" options={options} />
      <Select size="sm" aria-label="Small select example" options={options} />
    </>
  )
}

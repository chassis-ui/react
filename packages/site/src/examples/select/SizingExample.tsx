import { CxSelect } from '@chassis-ui/react'

export const Example = () => {
  const options = [
    { label: 'Choose an option', value: '' },
    { label: 'One', value: '1' },
    { label: 'Two', value: '2' },
    { label: 'Three', value: '3', disabled: true }
  ]
  return (
    <>
      <CxSelect size="large" aria-label="Large select example" options={options} />
      <CxSelect aria-label="Default select example" options={options} />
      <CxSelect size="small" aria-label="Small select example" options={options} />
    </>
  )
}

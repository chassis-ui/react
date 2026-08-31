import { TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <TextInput size="large" placeholder="Large input" aria-label="Large input example" />
      <TextInput placeholder="Default input" aria-label="Default input example" />
      <TextInput size="small" placeholder="Small input" aria-label="Small input example" />
    </>
  )
}

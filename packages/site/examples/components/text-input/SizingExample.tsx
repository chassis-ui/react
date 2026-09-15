import { TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <TextInput size="lg" placeholder="Large input" aria-label="Large input example" />
      <TextInput placeholder="Default input" aria-label="Default input example" />
      <TextInput size="sm" placeholder="Small input" aria-label="Small input example" />
    </>
  )
}

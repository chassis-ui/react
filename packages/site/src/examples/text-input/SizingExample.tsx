import { CxTextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxTextInput size="large" placeholder="Large input" aria-label="Large input example" />
      <CxTextInput placeholder="Default input" aria-label="Default input example" />
      <CxTextInput size="small" placeholder="Small input" aria-label="Small input example" />
    </>
  )
}

import { CxTextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxTextInput type="email" placeholder="name@example.com" aria-label="email example" />
      <CxTextInput type="password" placeholder="Password" aria-label="password example" />
      <CxTextInput type="date" aria-label="date example" />
    </>
  )
}

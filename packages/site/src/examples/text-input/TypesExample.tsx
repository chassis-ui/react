import { TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <TextInput type="email" placeholder="name@example.com" aria-label="email example" />
      <TextInput type="password" placeholder="Password" aria-label="password example" />
      <TextInput type="date" aria-label="date example" />
    </>
  )
}

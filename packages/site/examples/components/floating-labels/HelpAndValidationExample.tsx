import { FloatingInput, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FloatingInput help="We'll never share your email." label="Email address">
      <TextInput type="email" placeholder="name@example.com" />
    </FloatingInput>
  )
}

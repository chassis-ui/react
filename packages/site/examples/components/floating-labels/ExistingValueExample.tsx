import { FloatingInput, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FloatingInput label="Input with value">
      <TextInput type="email" placeholder="name@example.com" defaultValue="test@example.com" />
    </FloatingInput>
  )
}

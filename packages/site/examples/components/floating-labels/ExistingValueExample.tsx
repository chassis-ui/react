import { FloatingInput, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FloatingInput label="Input with value" ids={{ input: 'floatingInputValue' }}>
      <TextInput
        type="email"
        id="floatingInputValue"
        placeholder="name@example.com"
        defaultValue="test@example.com"
      />
    </FloatingInput>
  )
}

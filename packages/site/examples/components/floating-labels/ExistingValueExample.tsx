import { FloatingInput, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FloatingInput
      label="Input with value"
      ids={{ input: 'floatingInputValue', label: 'floatingInputValueLabel' }}
    >
      <TextInput
        type="email"
        id="floatingInputValue"
        aria-labelledby="floatingInputValueLabel"
        placeholder="name@example.com"
        defaultValue="test@example.com"
      />
    </FloatingInput>
  )
}

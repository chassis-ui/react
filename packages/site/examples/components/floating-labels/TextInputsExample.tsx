import { FloatingInput, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <FloatingInput className="mb-md" label="Email address">
        <TextInput type="email" placeholder="name@example.com" />
      </FloatingInput>
      <FloatingInput label="Password">
        <TextInput autoComplete="current-password" type="password" placeholder="Password" />
      </FloatingInput>
    </>
  )
}

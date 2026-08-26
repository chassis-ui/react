import { FloatingInput, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <FloatingInput className="mb-medium" label="Email address" ids={{ input: 'floatingInput' }}>
        <TextInput type="email" id="floatingInput" placeholder="name@example.com" />
      </FloatingInput>
      <FloatingInput label="Password" ids={{ input: 'floatingPassword' }}>
        <TextInput type="password" id="floatingPassword" placeholder="Password" />
      </FloatingInput>
    </>
  )
}

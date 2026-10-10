import { FloatingInput, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <FloatingInput
        className="mb-md"
        label="Email address"
        ids={{ input: 'floatingInput', label: 'floatingInputLabel' }}
      >
        <TextInput
          type="email"
          id="floatingInput"
          aria-labelledby="floatingInputLabel"
          placeholder="name@example.com"
        />
      </FloatingInput>
      <FloatingInput
        label="Password"
        ids={{ input: 'floatingPassword', label: 'floatingPasswordLabel' }}
      >
        <TextInput
          autoComplete="current-password"
          type="password"
          id="floatingPassword"
          aria-labelledby="floatingPasswordLabel"
          placeholder="Password"
        />
      </FloatingInput>
    </>
  )
}

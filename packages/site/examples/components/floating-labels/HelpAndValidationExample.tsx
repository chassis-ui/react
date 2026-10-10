import { FloatingInput, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FloatingInput
      help="We'll never share your email."
      ids={{
        help: 'floatingInputHelp',
        input: 'floatingInputHelpExample',
        label: 'floatingInputHelpExampleLabel'
      }}
      label="Email address"
    >
      <TextInput
        type="email"
        id="floatingInputHelpExample"
        aria-describedby="floatingInputHelp"
        aria-labelledby="floatingInputHelpExampleLabel"
        placeholder="name@example.com"
      />
    </FloatingInput>
  )
}

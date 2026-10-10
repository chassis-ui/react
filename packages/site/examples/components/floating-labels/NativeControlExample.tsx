import { FloatingInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FloatingInput
      help="As it appears on your passport."
      ids={{ help: 'floatingNativeHelp', input: 'floatingNative' }}
      label="Full name"
    >
      <input
        aria-describedby="floatingNativeHelp"
        className="form-input"
        id="floatingNative"
        placeholder="Jane Doe"
        type="text"
      />
    </FloatingInput>
  )
}

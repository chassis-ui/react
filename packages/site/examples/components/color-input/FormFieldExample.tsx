import { ColorInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <ColorInput
      label="Accent color"
      help="Used for links and primary buttons."
      defaultValue="#0d6efd"
      id="accentColor"
    />
  )
}

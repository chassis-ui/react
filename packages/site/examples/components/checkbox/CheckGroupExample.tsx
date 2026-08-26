import { Checkbox, CheckboxGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CheckboxGroup
      label="Notifications"
      description="Choose which notifications you'd like to receive."
      defaultValue={['email']}
    >
      <Checkbox value="email" label="Email" />
      <Checkbox value="sms" label="SMS" />
      <Checkbox value="push" label="Push" />
    </CheckboxGroup>
  )
}

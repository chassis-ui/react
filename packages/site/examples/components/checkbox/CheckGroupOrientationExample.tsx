import { Checkbox, CheckboxGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CheckboxGroup label="Notifications" defaultValue={['email']} orientation="horizontal">
      <Checkbox value="email" label="Email" />
      <Checkbox value="sms" label="SMS" />
      <Checkbox value="push" label="Push" />
    </CheckboxGroup>
  )
}

import { CxCheckbox, CxCheckboxGroup } from '@chassis-ui/react'

export const CheckGroupExample = () => {
  return (
    <CxCheckboxGroup
      label="Notifications"
      description="Choose which notifications you'd like to receive."
      defaultValue={['email']}
    >
      <CxCheckbox value="email" label="Email" />
      <CxCheckbox value="sms" label="SMS" />
      <CxCheckbox value="push" label="Push" />
    </CxCheckboxGroup>
  )
}

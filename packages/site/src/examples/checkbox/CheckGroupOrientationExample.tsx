import { CxCheckbox, CxCheckboxGroup } from '@chassis-ui/react'

export const CheckGroupOrientationExample = () => {
  return (
    <CxCheckboxGroup label="Notifications" defaultValue={['email']} orientation="horizontal">
      <CxCheckbox value="email" label="Email" />
      <CxCheckbox value="sms" label="SMS" />
      <CxCheckbox value="push" label="Push" />
    </CxCheckboxGroup>
  )
}

import { CxFormCheck, CxFormCheckGroup } from '@chassis-ui/react'

export const CheckGroupOrientationExample = () => {
  return (
    <CxFormCheckGroup label="Notifications" defaultValue={['email']} orientation="horizontal">
      <CxFormCheck value="email" label="Email" />
      <CxFormCheck value="sms" label="SMS" />
      <CxFormCheck value="push" label="Push" />
    </CxFormCheckGroup>
  )
}

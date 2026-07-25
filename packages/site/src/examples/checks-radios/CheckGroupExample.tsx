import React from 'react'
import { CxFormCheck, CxFormCheckGroup } from '@chassis-ui/react'

export const CheckGroupExample = () => {
  return (
    <CxFormCheckGroup
      label="Notifications"
      description="Choose which notifications you'd like to receive."
      defaultValue={['email']}
    >
      <CxFormCheck value="email" label="Email" />
      <CxFormCheck value="sms" label="SMS" />
      <CxFormCheck value="push" label="Push" />
    </CxFormCheckGroup>
  )
}

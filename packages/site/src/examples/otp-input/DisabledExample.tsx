import React from 'react'
import { CxOtpInput } from '@chassis-ui/react'

export const DisabledExample = () => {
  return (
    <CxOtpInput aria-label="Verification code" defaultValue="123" disabled inputGroup length={6} />
  )
}

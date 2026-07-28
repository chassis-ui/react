import { CxOtpInput } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <CxOtpInput
      label="Verification code"
      help="Enter the 6-digit code sent to your phone."
      inputGroup
      name="code"
    />
  )
}

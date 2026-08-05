import { OtpInput } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <OtpInput
      label="Verification code"
      help="Enter the 6-digit code sent to your phone."
      inputGroup
      name="code"
    />
  )
}

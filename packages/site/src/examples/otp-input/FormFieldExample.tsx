import { CxFormField, CxOtpInput } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <CxFormField
      label="Verification code"
      help="Enter the 6-digit code sent to your phone."
      ids={{ help: 'otpHelp', label: 'otpLabel' }}
    >
      <CxOtpInput aria-describedby="otpHelp" aria-labelledby="otpLabel" inputGroup name="code" />
    </CxFormField>
  )
}

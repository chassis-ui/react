import { CxFormLabel, CxFormText, CxOtpInput } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <div className="form-field">
      <CxFormLabel id="otpLabel">Verification code</CxFormLabel>
      <CxOtpInput aria-describedby="otpHelp" aria-labelledby="otpLabel" inputGroup name="code" />
      <CxFormText id="otpHelp">Enter the 6-digit code sent to your phone.</CxFormText>
    </div>
  )
}

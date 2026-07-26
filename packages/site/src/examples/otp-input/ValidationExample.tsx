import { CxOtpInput } from '@chassis-ui/react'

export const ValidationExample = () => {
  return (
    <div className="vstack gap-medium">
      <CxOtpInput aria-label="Verified code" defaultValue="123456" inputGroup valid />
      <CxOtpInput aria-label="Invalid code" defaultValue="123" inputGroup invalid />
    </div>
  )
}

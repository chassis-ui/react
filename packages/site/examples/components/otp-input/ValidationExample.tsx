import { OtpInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="vstack gap-medium">
      <OtpInput aria-label="Verified code" defaultValue="123456" inputGroup valid />
      <OtpInput aria-label="Invalid code" defaultValue="123" inputGroup invalid />
    </div>
  )
}

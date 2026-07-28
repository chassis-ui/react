import { CxAvatar } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxAvatar style={{ '--cx-avatar-size': '1.75rem' } as React.CSSProperties}>CX</CxAvatar>
      <CxAvatar style={{ '--cx-avatar-size': '4.25rem' } as React.CSSProperties}>CX</CxAvatar>
    </>
  )
}

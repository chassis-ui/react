import React, { forwardRef, HTMLAttributes } from 'react'

export const CxTableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ children, ...props }, ref) => {
  return (
    <caption {...props} ref={ref}>
      {children}
    </caption>
  )
})

CxTableCaption.displayName = 'CxTableCaption'

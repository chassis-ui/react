import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'

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

CxTableCaption.propTypes = {
  children: PropTypes.node,
}

CxTableCaption.displayName = 'CxTableCaption'

import React, { FC } from 'react'
import PropTypes from 'prop-types'

interface CalloutProps {
  className?: string
  context?: string
}

const Callout: FC<CalloutProps> = ({ children, className, context, ...rest }) => {
  return (
    <div
      className={`cxd-callout cxd-callout-${context}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {children}
    </div>
  )
}

Callout.propTypes = {
  className: PropTypes.string,
  context: PropTypes.string,
}

Callout.displayName = 'Callout'

export default Callout

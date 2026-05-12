import React, { FC } from 'react'
import PropTypes from 'prop-types'

interface ExampleProps {
  className?: string
}

const Example: FC<ExampleProps> = ({ children, className, ...rest }) => {
  return (
    <div className={`cxd-example-snippet cxd-code-snippet${className ? ` ${className}` : ''}`}>
      <div className="cxd-example context" {...rest}>
        {children}
      </div>
    </div>
  )
}

Example.propTypes = {
  className: PropTypes.string,
}

Example.displayName = 'Example'

export default Example

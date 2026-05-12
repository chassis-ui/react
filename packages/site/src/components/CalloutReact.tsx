import React from 'react'

interface CalloutProps {
  children?: React.ReactNode
  context?: 'info' | 'warning' | 'danger' | 'tip'
}

export function CalloutReact({ children, context = 'info' }: CalloutProps) {
  return (
    <div className={`cxd-callout cxd-callout-${context}`}>
      {children}
    </div>
  )
}

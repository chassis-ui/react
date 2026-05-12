import React from 'react'

interface ReactExamplePreviewProps {
  children: React.ReactNode
}

export function ReactExamplePreview({ children }: ReactExamplePreviewProps) {
  return (
    <div className="cxd-example context">
      {children}
    </div>
  )
}

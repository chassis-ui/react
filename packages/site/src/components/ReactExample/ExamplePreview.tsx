import React from 'react'

interface ExamplePreviewProps {
  children?: React.ReactNode
  className?: string
  class?: string
}

/**
 * ExamplePreview — pure React component used as the MDX `<Example>` mapping.
 * Wraps example content in the standard docs example container.
 * Used via `<Content components={{ Example: ExamplePreview }} />` in [...slug].astro.
 */
export function ExamplePreview({ children, className, class: cls }: ExamplePreviewProps) {
  const combined = [className, cls].filter(Boolean).join(' ')
  return (
    <div className={`cxd-example context${combined ? ' ' + combined : ''}`}>
      {children}
    </div>
  )
}

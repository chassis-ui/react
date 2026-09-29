'use client'

import type { ComponentType } from 'react'

// Takes a client component by reference, as an icon prop does. A reference passed as a prop
// value is what makes React hand over the element around it as a lazy node while the module
// loads. See ../README.md.
export function Holder({ icon: Icon }: { icon: ComponentType }) {
  return <Icon />
}

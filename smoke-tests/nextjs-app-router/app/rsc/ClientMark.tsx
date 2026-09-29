'use client'

import { useId } from 'react'

// A client component of the app's own, placed inside what a Server Component passes to the
// library. See ../README.md.
export function ClientMark() {
  const id = useId()
  return <span data-client-mark={id}>*</span>
}

'use client'

// Top-level await keeps this module loading while React reads the payload that references it.
// With `Holder` it puts an element in the state issue #37 depends on. See ../README.md.
await new Promise((resolve) => setTimeout(resolve, 300))

export function SlowMark() {
  return <span data-slow-mark="">~</span>
}

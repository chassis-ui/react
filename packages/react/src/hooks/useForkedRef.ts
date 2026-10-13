// code borrowed from https://github.com/reach/reach-ui
// problem described https://github.com/facebook/react/issues/13029

import { useMemo } from 'react'

// What a callback ref may return: since React 19, a function to run when the element goes away,
// in place of a second call with `null`.
type RefCleanup = () => void

// A callback ref is typed to return `void`, which takes a function returning anything: one that
// returns a cleanup, and one that returns something else by accident (an arrow function around
// `set.add(node)`, an async function).
export type AssignableRef<ValueType> =
  | {
      bivarianceHack(instance: ValueType | null): void
    }['bivarianceHack']
  | React.MutableRefObject<ValueType | null>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useForkedRef<RefValueType = any>(
  ...refs: (AssignableRef<RefValueType> | null | undefined)[]
) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (node: any): RefCleanup | undefined => {
      const cleanups = refs.map((ref) => assignRef(ref, node))
      // Called with `null` by hand (React doesn't, given the cleanup below): every ref has its
      // `null` already.
      if (node == null) return undefined
      // React runs this in place of calling the forked ref with `null`. A ref that returned a
      // cleanup gets that and no `null`, as React treats it on an element of its own; every other
      // ref is reset.
      return () => {
        refs.forEach((ref, index) => {
          const cleanup = cleanups[index]
          if (cleanup) cleanup()
          else assignRef(ref, null)
        })
      }
    }
  }, refs)
}

// Returns the cleanup a callback ref returned, if it returned one.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assignRef<RefValueType = any>(
  ref: AssignableRef<RefValueType> | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
): RefCleanup | undefined {
  if (ref == null) return undefined
  if (isFunction(ref)) {
    const cleanup: unknown = ref(value)
    return isFunction(cleanup) ? (cleanup as RefCleanup) : undefined
  }
  try {
    ref.current = value
  } catch (error) {
    throw new Error(`Cannot assign value "${value}" to ref "${ref}"`, { cause: error })
  }
  return undefined
}

// `typeof` rather than a `[object Function]` tag check, which an async function fails: an async
// callback ref was taken for an object ref and never called.
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type
export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

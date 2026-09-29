import { cloneElement, type ElementType, type ReactElement } from 'react'

// What React Server Components hand a client component in place of a value, in the shape the
// Flight client builds it (`createLazyChunkWrapper`: `$$typeof: react.lazy`, a `_payload` and an
// `_init` that returns the value or throws). Observed in `smoke-tests/nextjs-app-router`:
//
// - `lazyType`: every element whose type is a client component carries a lazy wrapper as its
//   `type`, in production too. Code that compares `child.type` sees the wrapper.
// - `lazyNode`: an element whose props hold something still loading is replaced by a lazy node.
//   It isn't a valid element, so code that inspects children (`isValidElement`, `child.props`)
//   sees something else until React resolves it. See #37.
// - `pendingLazyNode`: the same node before its value is there. Reading it throws a thenable,
//   which is how a lazy component suspends.
//
// Typed as elements because that is what the components' props declare, and what a Server
// Component's JSX promises; at runtime a lazy node isn't one.
const REACT_LAZY_TYPE = Symbol.for('react.lazy')

// The Flight client's chunk: what a lazy node holds, and what React's development build reads
// the `status` of when it validates children.
interface Chunk<T> {
  status: 'pending' | 'fulfilled'
  value: T | null
}

function lazy<T>(chunk: Chunk<T>, loading?: Promise<void>) {
  return {
    $$typeof: REACT_LAZY_TYPE,
    _payload: chunk,
    _init: (payload: Chunk<T>) => {
      if (payload.status !== 'fulfilled') throw loading
      return payload.value
    }
  }
}

export function lazyNode(element: ReactElement): ReactElement {
  return lazy({ status: 'fulfilled', value: element }) as unknown as ReactElement
}

export function lazyType(element: ReactElement): ReactElement {
  // A host element keeps its tag: only a client component's type is a module to load.
  if (typeof element.type === 'string') return element
  const type = lazy({ status: 'fulfilled', value: element.type as ElementType })
  // `cloneElement` keeps the type, so the element is rebuilt around the wrapper.
  return { ...cloneElement(element), type } as unknown as ReactElement
}

// A lazy node that is loading until `resolve` is called.
export function pendingLazyNode(element: ReactElement): {
  node: ReactElement
  resolve: () => Promise<void>
} {
  const chunk: Chunk<ReactElement> = { status: 'pending', value: null }
  let release: () => void = () => undefined
  const loading = new Promise<void>((done) => {
    release = done
  })
  return {
    node: lazy(chunk, loading) as unknown as ReactElement,
    resolve: () => {
      chunk.status = 'fulfilled'
      chunk.value = element
      release()
      return loading
    }
  }
}

import { isValidElement, ReactElement } from 'react'

// What React Server Components hand a client component in place of a value that isn't ready, or
// that they never resolve eagerly. Two cases reach this library, both from a Server Component
// that composes its components directly:
//
// - An element's `type`, when it is a client component: always a lazy wrapper around the module,
//   in a production build too. `child.type === ListItem` is therefore false for a `<ListItem>`
//   written in a Server Component.
// - A whole element, when something in its props is still loading (a client component passed by
//   reference, a server function): a lazy node, which is not a valid element and has no `props`.
//   See #37.
//
// React resolves both when it renders them. Code that reads a child before rendering it
// (`isValidElement`, `child.type === X`, `child.props`) has to resolve them itself, the way
// React's own `Children` helpers do: by calling the node's `_init` with its `_payload`. That
// returns the value, or throws what React throws for a lazy component: a thenable while the value
// is loading, which suspends the component until it is there, or the error it failed with.
const REACT_LAZY_TYPE = Symbol.for('react.lazy')

interface LazyNode {
  $$typeof: symbol
  _init: (payload: unknown) => unknown
  _payload: unknown
}

const isLazy = (value: unknown): value is LazyNode =>
  typeof value === 'object' &&
  value !== null &&
  (value as LazyNode).$$typeof === REACT_LAZY_TYPE &&
  typeof (value as LazyNode)._init === 'function'

// The value a lazy node or lazy type stands for; anything else comes back as it is. A lazy value
// can hold another, so this unwraps until it reaches one that isn't.
export function resolveLazy<T>(value: T): T {
  let resolved: unknown = value
  while (isLazy(resolved)) resolved = resolved._init(resolved._payload)
  return resolved as T
}

// Whether `node` is an element of `Component`. Replaces `isValidElement(node) && node.type ===
// Component`, which a Server Component's children fail.
export function isElementOfType<P>(
  node: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: (props: any) => unknown
): node is ReactElement<P>
export function isElementOfType<P>(node: unknown, Component: object): node is ReactElement<P>
export function isElementOfType<P>(node: unknown, Component: unknown): node is ReactElement<P> {
  if (!isValidElement(node)) return false
  return node.type === Component || resolveLazy(node.type) === Component
}

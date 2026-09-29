import type { ReactElement } from 'react'

// The node React Server Components hand a client component for an element passed from the server
// whose subtree references a client module that hasn't loaded yet: not the element itself, but a
// lazy node wrapping it (`$$typeof: react.lazy`, resolved by React when it renders the node). It
// isn't a valid element, so code that inspects children (`isValidElement`, `child.props`,
// `child.type === X`) sees something else until React resolves it. See #37.
//
// Typed as an element because that is what the components' props declare, and what a Server
// Component's JSX promises; at runtime it isn't one. Built by hand in the shape of the Flight client's own lazy chunks, already resolved; not captured
// from a running Next.js app.
export function lazyNode(element: ReactElement): ReactElement {
  return {
    $$typeof: Symbol.for('react.lazy'),
    _payload: element,
    _init: (payload: ReactElement) => payload
  } as unknown as ReactElement
}
